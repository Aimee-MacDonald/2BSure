const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/register", (req, res) => {
  res.status(200).render("register");
});

router.get("/login", (req, res) => {
  res.status(200).render("login");
});

router.post("/register", (req, res) => {
  console.log("Auth Data:");
  console.log(req.body);
});

router.post("/login", (req, res) => {
  console.log("Auth Data:");
  console.log(req.body);
});

module.exports = router;
