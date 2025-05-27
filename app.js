const path = require("path");
require("dotenv").config({
  path: path.resolve(
    __dirname,
    process.env.NODE_ENV == "production" ? ".env.production" : ".env"
  ),
});
const express = require("express");
const { morgan, errorLoggerFile } = require("./helpers/logger");
const cors = require("./middleware/corsMdw");
const router = require("./routes/router");
const connectToDB = require("./helpers/dbService");

const app = express();
app.use(cors);
app.use(express.json());

app.use(morgan(`:custom-date :method :full-url :status :response-time ms`));
app.use(
  morgan(":custom-error", {
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
