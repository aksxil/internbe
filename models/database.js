const mongoose = require("mongoose");

exports.connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log("Database Connection Established!");
  } catch (error) {
    console.log("Error connecting to the database:", error.message);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.once('open', () => {
    console.log('MongoDB connected');
  });
};
