const express = require("express");
const router = express.Router();
const path = require("path");

router.post("/register", (req, res) => {
  console.log("Auth Data:");
  console.log(req.body);
  res.redirect("/user");
});

router.post("/login", (req, res) => {
  console.log("Auth Data:");
  console.log(req.body);
  res.redirect("/user");
});

module.exports = router;
