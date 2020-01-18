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

const auth = require(path.join(__dirname, "/routes/auth"));
const mockapi = require(path.join(__dirname, "/routes/mockapi"));

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
    res.status(200).render("user");
  } else {
    res.redirect("/login");
  }
});

app.get("/admin", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, docs) => {
      if(err) res.redirect("/error");

      if(docs.access === "admin"){
        res.status(200).render("admin");
      } else {
        res.redirect("/user");
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/verifyEmail", (req, res) => {
  EmailVerification.find({'verificationCode': req.query.code}, (err, vers) => {
    if(err) res.redirect("/error");

    if(vers.length > 0){
      User.findOne({'email': vers[0].email}, (err, user) => {
        if(err) res.redirect("/error");

        user.verifiedEmail = true;
        user.save();

        EmailVerification.deleteOne({'verificationCode': req.query.code}, (err) => {
          if(err) res.redirect("/error");
        });

        res.render("emailVerification");
      });
    } else {
      res.redirect("/error");
    }
  });
});

app.get("/landing", (req, res) => {
  res.status(200).render("landing");
});

app.get("/addToCart", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, usr) => {
      Cart.findOne({'userID': req.session.passport.user}, (err2, docs) => {
        if(err2) res.redirect("/error");

        if(docs){
          docs[req.query.product] = docs[req.query.product] + 1;
          docs.lastEdit = new Date().getTime();

          docs.save(err => {
            if(err) res.redirect("/error");
          });

          res.redirect("/cart");
        } else {
          var newCart = new Cart({
            'userID': req.session.passport.user,
            lastEdit: new Date().getTime(),
            product1: 0,
            product2: 0,
            product3: 0,
            product4: 0
          });

          newCart[req.query.product] = newCart[req.query.product] + 1;

          newCart.save(err => {
            if(err) res.redirect("/error");
          });

          res.redirect("/cart");
        }
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/cart", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, usr) => {
      if(err) res.redirect("/error");

      Cart.findOne({'userID': usr._id}, (err2, crt) => {
        if(err2) res.redirect("/error");

        var respac = {};
        if(crt){
          if(crt.product1 > 0) respac.value1 = "Product 1: " + crt.product1;
          if(crt.product2 > 0) respac.value2 = "Product 2: " + crt.product2;
          if(crt.product3 > 0) respac.value3 = "Product 3: " + crt.product3;
          if(crt.product4 > 0) respac.value4 = "Product 4: " + crt.product4;
        }

        res.status(200).render("cart", {'cart': respac});
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/ketosis", (req, res) => {
  res.send("<h1>Page not yet Implemented</h1>");
});

app.get("/ketomojo", (req, res) => {
  res.send("<h1>Page not yet Implemented</h1>");
});

app.get("/instructions", (req, res) => {
  res.send("<h1>Page not yet Implemented</h1>");
});

app.get("/order_history", (req, res) => {
  res.send("<h1>Page not yet Implemented</h1>");
});

app.get("/privacy_policy", (req, res) => {
  res.send("<h1>Page not yet Implemented</h1>");
});

app.get("/terms_of_service", (req, res) => {
  res.send("<h1>Page not yet Implemented</h1>");
});

app.get("/learn_more", (req, res) => {
  res.status(200).render("information");
});

app.get("/removeFromCart", (req, res) => {
  if(req.isAuthenticated()){
    Cart.findOne({'userID': req.session.passport.user}, (err, crt) => {
      if(err) res.redirect("/error");

      if(crt && crt[req.query.product] > 0){
        crt[req.query.product] = crt[req.query.product] - 1;

        crt.save(err2 => {
          if(err2) res.redirect("/error");
        });
      }
    });

    res.redirect("/cart");
  } else {
    res.redirect("/login");
  }
});

app.get("/verifyAddress", (req, res) => {
  if(!req.isAuthenticated()) res.redirect("/login");
  res.status(200).render("verifyAddress", {csrfToken: req.csrfToken()});
});

app.post("/verifyAddress", (req, res) => {
  if(!req.isAuthenticated()) res.redirect("/login");

  res.redirect("/payment");
});

app.get("/payment", (req, res) => {
  if(!req.isAuthenticated()) res.redirect("/login");
  res.status(200).render("payment", {csrfToken: req.csrfToken()});
});

app.post("/payment", (req, res) => {
  if(!req.isAuthenticated()) res.redirect("/login");
  res.redirect("/user");
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
