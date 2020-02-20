const express = require("express");
const router = express.Router();
const path = require("path");

const Order = require(path.join(__dirname, "../dbmodels/order"));
const User = require(path.join(__dirname, "../dbmodels/user"));

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    Order.find({'userID': req.session.passport.user}, (err, ords) => {
      if(err){
        res.redirect("/error");
      } else {
        var respac = {};
        if(ords){
          respac.orders = ords;
        } else {
          respac.orders = [];
        }

        res.status(200).render("user", respac);
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/admin", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, docs) => {
      if(err){
        res.redirect("/error");
      } else {
        if(docs.access === "admin"){
          res.status(200).render("admin", {csrfToken: req.csrfToken()});
        } else {
          res.redirect("/user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/admin/addStock", (req, res) => {
  if(req.isAuthenticated){
    console.log("Add Stock");
    console.log(req.body);
    res.redirect("/user/admin");
  } else {
    res.redirect("login");
  }
});

module.exports = router;
