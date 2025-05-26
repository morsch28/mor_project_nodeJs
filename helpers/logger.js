const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const date = new Date();

morgan.token("custom-date", () => {
  const now = new Date();
  return now.toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
});

morgan.token("full-url", (req) => {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
});

morgan.token("custom-error", (req, res) => {
  return `[${new Date().toISOString()}] - ${res.statusCode}, ${
    res.statusMessage
  }`;
});

const errorLoggerFile = {
  write: (message) => {
    const mainDir = path.resolve(__dirname, "..");
    const logDir = path.join(mainDir, "log");
    const fileName = path.join(
      logDir,
      `${new Date().toISOString().slice(0, 10)}.log`
    );

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    fs.appendFile(fileName, message, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  },
};

module.exports = { morgan, errorLoggerFile };
