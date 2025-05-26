require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const morgan = require("morgan");
const { morgan, errorLoggerFile } = require("./helpers/logger");
const cors = require("./middleware/corsMdw");
const { initialUsers, initialCards } = require("./helpers/initialData");
const router = require("./routes/router");
const connectToDB = require("./helpers/dbServises");

const app = express();
// app.use(morgan("dev"));
app.use(cors);
app.use(express.json());

app.use(morgan(`:custom-date :method :full-url :status :response-time ms`));
app.use(
  morgan("custom-error", {
    skip: (req, res) => res.statusCode < 400,
    stream: errorLoggerFile,
  })
);

app.use(router);

const PORT = process.env.PORT || 8080;
const startServer = async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
startServer();
