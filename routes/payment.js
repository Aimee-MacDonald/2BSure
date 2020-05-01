const express = require("express");
const router = express.Router();
const path = require("path");

const Cart = require(path.join(__dirname, "../dbmodels/cart"));
const Address = require(path.join(__dirname, "../dbmodels/address"));
const Order = require(path.join(__dirname, "../dbmodels/order"));

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    Cart.findOne({'userID': req.session.passport.user}, (err, crt) => {
      if(err){
        res.redirect("/error");
      } else {
        if(crt){
          var respac = {};
          respac.cartTotal = crt.total;
          respac.cartID = crt.id;
          respac.cartProducts = crt.products;
          respac.csrfToken = req.csrfToken();

          Address.findOne({'userID': req.session.passport.user}, (err2, adr) => {
            if(err2){
              res.redirect("/error");
            } else {
              if(adr){
                respac.firstname = adr.firstname;
                respac.lastname = adr.lastname;
                respac.number = adr.number;
                respac.street = adr.street;
                respac.city = adr.city;
                respac.postcode = adr.postcode;
                respac.province = adr.province;
              }

              res.status(200).render("payment", respac);
            }
          });
        } else {
          res.redirect("/cart");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
