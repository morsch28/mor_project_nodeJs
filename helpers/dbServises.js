require("dotenv").config();
const mongoose = require("mongoose");
const { initialUsers, initialCards } = require("./initialData");

const connectToDB = async () => {
  const URI =
    process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_MONGO_URI
      : process.env.DEVELOP_MONGO_URI;

  try {
    await mongoose.connect(URI);
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
