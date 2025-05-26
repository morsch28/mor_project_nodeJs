const express = require("express");
const router = express.Router();

//login
router.use("/users/login", require("./login_routes"));

router.use("/users", require("./users_routes"));

router.use("/cards", require("./cards_routes"));

router.use((req, res) => {
  return res.status(404).send("Route Not Found");
});

module.exports = router;
