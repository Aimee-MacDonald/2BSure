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
