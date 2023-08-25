// This is used for MongoDb Connection
const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://karthikdurai216:${process.env.MONGODB_CONNECTION_PASSWORD}@karthik-d.zkla03h.mongodb.net/work-management-software-db?retryWrites=true&w=majority`
    );
    console.log("MongoDB Database is connected successfully");
  } catch (err) {
    console.log("Error is: " + err);
  }
};

module.exports = connectMongoDB;
