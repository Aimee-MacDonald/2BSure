const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const csurf = require("csurf");
const nodemailer = require("nodemailer");

const User = require(path.join(__dirname, "/dbmodels/user"));
const EmailVerification = require(path.join(__dirname, "/dbmodels/emailVerification"));
const Product = require(path.join(__dirname, "/dbmodels/product"));
const Cart = require(path.join(__dirname, "/dbmodels/cart"));
const Order = require(path.join(__dirname, "/dbmodels/order"));
const Address = require(path.join(__dirname, "/dbmodels/address"));

const auth = require(path.join(__dirname, "/routes/auth"));
const mockapi = require(path.join(__dirname, "/routes/mockapi"));
const info = require(path.join(__dirname, "/routes/info"));

mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, "/static")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(csurf());

app.use("/auth", auth);
app.use("/mockapi", mockapi);
app.use("/info", info);

app.get("/", (req, res) => {
  res.status(200).render("holding");
});

app.get("/products", (req, res) => {
  res.status(200).render("products");
});

app.get("/register", (req, res) => {
  res.status(200).render("register", {csrfToken: req.csrfToken()});
});

app.get("/login", (req, res) => {
  res.status(200).render("login", {csrfToken: req.csrfToken()});
});

app.get("/user", (req, res) => {
  if(req.isAuthenticated()){
    Order.find({'userID': req.session.passport.user}, (err, ords) => {
      if(err){
        res.redirect("/error");
      } else {
        var respac = {};
        respac.orders = [];
        if(ords.length > 0){
          for(var i = 0; i < ords.length; i++){
            var ord = {
              'status': ords[i].status,
              'product1': ords[i].product1,
              'product2': ords[i].product2,
              'product3': ords[i].product3
            }

            respac.orders.push(ord);
          }
        }

        res.status(200).render("user", respac);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/admin", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, docs) => {
      if(err){
        res.redirect("/error");
      } else {
        if(docs.access === "admin"){
          res.status(200).render("admin");
        } else {
          res.redirect("/user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/verifyEmail", (req, res) => {
  EmailVerification.find({'verificationCode': req.query.code}, (err, vers) => {
    if(err){
      res.redirect("/error");
    } else {
      if(vers.length > 0){
        User.findOne({'email': vers[0].email}, (err2, user) => {
          if(err2){
            res.redirect("error");
          } else {
            user.verifiedEmail = true;
            user.save(err3 => {
              if(err3){
                res.redirect("/error");
              } else {
                EmailVerification.deleteOne({'verificationCode': req.query.code}, (err4) => {
                  if(err4){
                    res.redirect("/error");
                  } else {
                    res.render("emailVerification");
                  }
                });
              }
            });
          }
        });
      } else {
        res.redirect("/error");
      }
    }
  });
});

app.get("/landing", (req, res) => {
  if(req.isAuthenticated()){
    Product.find({}, (err, prds) => {
      if(err){
        res.redirect("/error");
      } else {
        var respac = {};
        respac.products = prds;
        res.status(200).render("landing", respac);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/addToCart", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, usr) => {
      if(err){
        res.redirect("/error");
      } else {
        Cart.findOne({'userID': req.session.passport.user}, (err2, docs) => {
          if(err2){
            res.redirect("/error");
          } else {
            if(docs){
              docs[req.query.product] = docs[req.query.product] + 1;
              docs.lastEdit = new Date().getTime();

              docs.save(err3 => {
                if(err3){
                  res.redirect("/error");
                } else {
                  res.redirect("/cart");
                }
              });
            } else {
              var newCart = new Cart({
                'userID': req.session.passport.user,
                'lastEdit': new Date().getTime(),
                'product1': 0,
                'product2': 0,
                'product3': 0
              });

              newCart[req.query.product] = newCart[req.query.product] + 1;

              newCart.save(err4 => {
                if(err4){
                  res.redirect("/error");
                } else {
                  res.redirect("/cart");
                }
              });
            }
          }
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/cart", (req, res) => {
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

app.get("/learn_more", (req, res) => {
  res.status(200).render("information");
});

app.get("/removeFromCart", (req, res) => {
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

app.get("/verifyAddress", (req, res) => {
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

app.post("/verifyAddress", (req, res) => {
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

app.get("/payment", (req, res) => {
  if(req.isAuthenticated()){
    Cart.findOne({'userID': req.session.passport.user}, (err, crt) => {
      if(err){
        res.redirect("/error");
      } else {
        var respac = {};
        respac.csrfToken = req.csrfToken();

        if(crt){
          var rescart = [];
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

          respac.cart = rescart;
        }

        console.log(respac);
        res.status(200).render("payment", respac);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/payment", (req, res) => {
  if(req.isAuthenticated()){
    Cart.findOne({'userID': req.session.passport.user}, (err, crt) => {
      if(err){
        res.redirect("/error");
      } else {
        if(crt){
          var newOrder = new Order({
            'userID': req.session.passport.user,
            'status': "requested",
            'product1': crt.product1,
            'product2': crt.product2,
            'product3': crt.product3
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

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("*", (req, res) => {
  res.render("notfound");
});

passport.serializeUser(function(uid, done){
  done(null, uid);
});

passport.deserializeUser(function(uid, done){
  done(null, uid);
});

app.listen(process.env.PORT);
