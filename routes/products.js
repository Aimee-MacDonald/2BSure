const express = require("express");
const router = express.Router();
const path = require("path");

const Product = require(path.join(__dirname, "../dbmodels/product"));

router.get("/", (req, res) => {
  Product.find({}, (err, prds) => {
    if(err){
      res.redirect("/error");
    } else {
      var respac = {};
      respac.products = prds;
      respac.csrfToken = req.csrfToken();
      res.status(200).render("products", respac);
    }
  });
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
