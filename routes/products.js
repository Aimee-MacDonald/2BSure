const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("products");
});

router.get("/ketomojo", (req, res) => {
  res.status(200).render("ketomojo");
});

router.get("/glucose_strips", (req, res) => {
  res.status(200).render("glucose_strips");
});

router.get("/ketone_strips", (req, res) => {
  res.status(200).render("ketone_strips");
});

module.exports = router;
