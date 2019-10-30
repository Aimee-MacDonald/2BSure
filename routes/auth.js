const express = require("express");
const router = express.Router();
const path = require("path");

router.post("/register", (req, res) => {
  console.log("Auth Data:");
  console.log(req.body);
});

router.post("/login", (req, res) => {
  console.log("Auth Data:");
  console.log(req.body);
});

module.exports = router;
