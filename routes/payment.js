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
          respac.csrfToken = req.csrfToken();
          respac.total = crt.total;
          res.status(200).render("payment", respac);
        } else {
          res.redirect("/cart");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/", (req, res) => {
  if(req.isAuthenticated()){
    Cart.findOne({'userID': req.session.passport.user}, (err, crt) => {
      if(err){
        res.redirect("/error");
      } else {
        if(crt){
          var newOrder = new Order({
            'userID': req.session.passport.user,
            'status': "requested",
            'products': crt.products,
            'total': crt.total
          });

          newOrder.save(err2 => {
            if(err2){
              res.redirect("/error");
            } else {
              Cart.deleteOne({'_id': crt._id}, err3 => {
                if(err3){
                  res.redirect("/error");
                } else {
                  res.redirect("/user");
                }
              });
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

router.get("/verifyAddress", (req, res) => {
  if(req.isAuthenticated()){
    Address.findOne({'userID': req.session.passport.user}, (err, adr) => {
      if(err){
        res.redirect("/error");
      } else {
        var respac = {};
        respac.csrfToken = req.csrfToken();

        if(adr){
          respac.line1 = adr.line1;
          respac.line2 = adr.line2;
          respac.town = adr.town;
          respac.province = adr.province;
          respac.postcode = adr.postcode;
        }

        res.status(200).render("verifyAddress", respac);
      }
    });
  } else {
     res.redirect("/login");
  }
});

router.post("/verifyAddress", (req, res) => {
  if(req.isAuthenticated()){
    Address.findOne({'userID': req.session.passport.user}, (err, adr) => {
      if(err){
        res.redirect("/error");
      } else {
        if(adr){
          adr.line1 = req.body.line1;
          adr.line2 = req.body.line2;
          adr.town = req.body.town;
          adr.province = req.body.province;
          adr.postcode = req.body.postcode;

          adr.save(err2 => {
            if(err2){
              res.redirect("/error");
            } else {
              res.redirect("/payment");
            }
          });
        } else {
          var newAdr = new Address({
            'userID': req.session.passport.user,
            'line1': req.body.line1,
            'line2': req.body.line2,
            'town': req.body.town,
            'province': req.body.province,
            'postcode': req.body.postcode
          });

          newAdr.save(err3 => {
            if(err3){
              res.redirect("/error");
            } else {
              res.redirect("/payment");
            }
          });
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
