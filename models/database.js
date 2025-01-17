const mongoose = require("mongoose");

exports.connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // Optional: Set a timeout
    });
    console.log("Database Connection Established!");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};
