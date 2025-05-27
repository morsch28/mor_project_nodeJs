require("dotenv").config();
const mongoose = require("mongoose");
const { initialUsers, initialCards } = require("./initialData");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    if (process.env.NODE_ENV === "development") {
      await initialUsers();
      await initialCards();
    }
  } catch (error) {
    console.log("Cannot connect to database:" + error);
  }
};

module.exports = connectToDB;
