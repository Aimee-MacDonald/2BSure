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

const auth = require(path.join(__dirname, "/routes/auth"));

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

app.get("/", (req, res) => {
  res.status(200).render("holding");
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
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, usr) => {
      Product.find({}, (err, docs) => {
        if(err) res.redirect("/error");
        res.status(200).render("landing", {'products': docs, 'csrfToken': req.csrfToken(), 'cartCount': usr.cart.length});
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/addToCart", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, usr) => {
      if(err) res.redirect("/error");

      usr.cart.push(req.body.id);
      usr.save(err => {
        if(err) res.redirect("/error");
      });

      res.status(200).send("Success");
    });
  } else {
    // User not Logged in
    res.redirect("/login");
  }
});

app.get("/cart", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, usr) => {
      if(err) res.redirect("/error");

      res.status(200).render("cart", {'cart': usr.cart});
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/ketomojo", (req, res) => {
  res.send("<h1>Page not yet Implemented</h1>");
});

app.get("/ketosis", (req, res) => {
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

app.get("/addToCart", (req, res) => {
  console.log("Add to Cart:");
  console.log(req.query.PRODUCT);
  res.send("<h1>Page not yet Implemented</h1>");
});

app.get("/more_products", (req, res) => {
  res.send("<h1>Page not yet Implemented</h1>");
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
