const jwt = require("jsonwebtoken");
const { User } = require("../model/users");

module.exports = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    res.status(400).send("Access denied, no token provided");
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    if (!req.user) {
      res.status(400).send("Not found");
      return;
    }
    next();
  } catch (error) {
    res.status(400).send("Access denied, no token provided");
  }
};
