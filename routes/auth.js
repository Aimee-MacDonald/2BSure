const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require(path.join(__dirname, "../dbmodels/user"));
const EmailVerification = require(path.join(__dirname, "../dbmodels/emailVerification"));

router.post("/register", (req, res) => {
  User.find({'email': req.body.email}, (err, docs) => {
    if(err) res.redirect("/error");

    if(docs.length > 0){
      // User Already Exists
      res.redirect("/login");
    } else {
      var newUser = new User({
        'email': req.body.email,
        'password': req.body.password,
        'access': "user",
        'verifiedEmail': false
      });

      newUser.save(err => {
        if(err) res.redirect("/error");

        User.find({'email': req.body.email}, (err, docs) => {
          if(err) res.redirect("/error");

          req.login(docs[0]._id, (err) => {
            if(err) res.redirect("/error");

            sendVerificationEmail(req.body.email, docs[0]._id);

            res.redirect("/user");
          });
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  User.find({'email': req.body.email}, (err, docs) => {
    if(err) res.redirect("/error");

    if(docs.length > 0){
      bcrypt.compare(req.body.password, docs[0].password, (err, resp) => {
        if(err) res.redirect("/error");

        if(resp){
          req.login(docs[0]._id, (err) => {
            if(err) res.redirect("/error");
          });

          if(docs[0].access === "admin"){
            res.redirect("/admin");
          } else {
            res.redirect("/user");
          }
        } else {
          // Invalid Credentials
          res.redirect("/login");
        }
      });
    } else {
      // No Such User
      res.redirect("/register");
    }
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/forgotPassword", (req, res) => {
  res.status(200).render("forgotPassword", {csrfToken: req.csrfToken()});
});

function sendVerificationEmail(userEmail, userId){
  var newVerification = new EmailVerification({
    'email': userEmail,
    'verificationCode': userId
  });

  newVerification.save(err => {
    if(err) throw err;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS
      }
    });

    const mailoptions = {
      from: 'aimeelmacdonald@gmail.com',
      to: userEmail,
      subject: 'Welcome to 2BSure',
      text: "Please click this link to verify your email:",
      html: "<a href='https://twobsure.herokuapp.com/verifyEmail?code=" + userId + "'> Verify Email"
    };

    transporter.sendMail(mailoptions, (err, info) => {
      if(err) throw err;
    });
  });
}

module.exports = router;
