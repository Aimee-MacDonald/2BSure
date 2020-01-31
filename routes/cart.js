const express = require("express");
const router = express.Router();
const path = require("path");

const User = require(path.join(__dirname, "../dbmodels/user"));
const Cart = require(path.join(__dirname, "../dbmodels/cart"));
const Product = require(path.join(__dirname, "../dbmodels/product"));

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, usr) => {
      if(err){
        res.redirect("/error");
      } else {
        Cart.findOne({'userID': usr._id}, (err2, crt) => {
          if(err2){
            res.redirect("/error");
          } else {
            var respac = {};
            var rescart = [];

            if(crt){
              if(crt.product1 > 0){
                rescart.push({
                  'name': 'product1',
                  'quantity': crt.product1
                });
              }

              if(crt.product2 > 0){
                rescart.push({
                  'name': 'product2',
                  'quantity': crt.product2
                });
              }

              if(crt.product3 > 0){
                rescart.push({
                  'name': 'product3',
                  'quantity': crt.product3
                });
              }
            }

            respac.cart = rescart;
            res.status(200).render("cart", respac);
          }
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/addToCart", (req, res) => {
  if(req.isAuthenticated()){
    Product.findById(req.body.product, (err, prd) => {
      if(err){
        res.redirect("/error");
      } else {
        Cart.findOne({'userID': req.session.passport.user}, (err, crt) => {
          if(err){
            res.redirect("/error");
          } else {
            if(crt){
              for(var i = 0; i < crt.products.length; i++){
                if(crt.products[i].productID === req.body.product){
                  crt.products[i].quantity = crt.products[i].quantity + 1;
                  crt.products[i].subTotal = crt.products[i].quantity * prd.price;
                  crt.markModified('products');
                }
              }

              if(!crt.isModified('products')){
                crt.products.push({
                  'productID': req.body.product,
                  'quantity': 1,
                  'subTotal': prd.price
                });
              }
            } else {
              crt = new Cart({
                'userID': req.session.passport.user,
                'lastEdit': new Date().getTime(),
                'products': [{
                  'productID': req.body.product,
                  'quantity': 1,
                  'subTotal': prd.price
                }],
                'total': prd.price
              });
            }
          }

          crt.total = 0;
          for(var i = 0; i < crt.products.length; i++){
            crt.total += crt.products[i].subTotal;
          }

          crt.save(err => {
            if(err){
              res.redirect("/error");
            } else {
              res.redirect("/cart");
            }
          })
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/removeFromCart", (req, res) => {
  if(req.isAuthenticated()){
    Cart.findOne({'userID': req.session.passport.user}, (err, crt) => {
      if(err){
        res.redirect("/error");
      } else {
        if(crt && crt[req.query.product] > 0){
          crt[req.query.product] = crt[req.query.product] - 1;

          crt.save(err2 => {
            if(err2){
              res.redirect("/error");
            }
          });
        }
        res.redirect("/cart");
      }
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
