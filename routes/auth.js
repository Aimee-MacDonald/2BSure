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
  res.status(200).render("register");
});

router.post("/login", (req, res) => {
  res.status(200).render("login");
});

module.exports = router;
