require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// CORS configuration
const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));

// Database connection
const { connectDatabase } = require("./models/database");
connectDatabase();

// Logger
const logger = require("morgan");
app.use(logger("tiny"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session and cookie
const session = require("express-session");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Express file-upload
const fileUpload = require("express-fileupload");
app.use(fileUpload());

// Routes
app.use("/", require("./routes/indexRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/employe", require("./routes/employeRoutes"));

// Error handling
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/errors");

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`URL not found: ${req.originalUrl}`, 404));
});

app.use(generatedErrors);

// Test route to verify MongoDB connection
app.get('/test-connection', async (req, res) => {
  try {
    const result = await mongoose.connection.db.admin().ping();
    res.status(200).json({ message: 'Connected to MongoDB Atlas', result });
  } catch (error) {
    res.status(500).json({ message: 'Connection to MongoDB Atlas failed', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
