const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("information");
});

router.get("/ketomojo", (req, res) => {
  res.status(200).render("ketomojo_info");
});

router.get("/ketosis", (req, res) => {
  res.status(200).render("ketosis_info");
});

router.get("/instructions", (req, res) => {
  res.status(200).render("instructions");
});

router.get("/privacy_policy", (req, res) => {
  res.status(200).render("privacy_policy");
});

router.get("/terms_of_service", (req, res) => {
  res.status(200).render("terms_of_service");
});

module.exports = router;
