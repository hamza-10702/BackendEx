import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dName: "checkingDB",
    };

    mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("DataBase Successfully connected...");

  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB
