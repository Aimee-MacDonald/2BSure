const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require(path.join(__dirname, "../dbmodels/user"));
const EmailVerification = require(path.join(__dirname, "../dbmodels/emailVerification"));
const PasswordReset = require(path.join(__dirname, "../dbmodels/passwordReset"));

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

            var newVerification = new EmailVerification({
              'email': req.body.email,
              'verificationCode': docs[0]._id
            });

            newVerification.save(err => {
              if(err) res.redirect("/error");

              var mailoptions = {
                from: 'aimeelmacdonald@gmail.com',
                to: req.body.email,
                subject: 'Welcome to 2BSure',
                text: "Please click this link to verify your email:",
                html: "<a href='https://twobsure.herokuapp.com/verifyEmail?code=" + docs[0]._id + "'> Verify Email"
              };

              sendEmail(mailoptions);
              res.redirect("/user");
            });
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

router.post("/forgotPassword", (req, res) => {
  User.find({'email': req.body.email}, (err, docs) => {
    if(err) res.redirect("/error");

    if(docs.length > 0){
      var newPR = new PasswordReset({
        'email': req.body.email,
        'resetCode': docs[0]._id
      });

      newPR.save(err => {
        if(err) res.redirect("/error");

        var mailoptions = {
          from: 'aimeelmacdonald@gmail.com',
          to: req.body.email,
          subject: '2BSure Password Reset',
          text: "Please click this link to reset your password:",
          html: "<a href='https://twobsure.herokuapp.com/auth/resetPassword?code=" + docs[0]._id + "'> Reset Password"
        };

        sendEmail(mailoptions);
        res.redirect("/login");
      });
    } else {
      // No such User
      res.redirect("/error");
    }
  });
});

router.get("/resetPassword", (req, res) => {
  res.status(200).render("resetPassword", {csrfToken: req.csrfToken(), code: req.query.code});
});

router.post("/resetPassword", (req, res) => {
  PasswordReset.find({'resetCode': req.body.code}, (err, docs) => {
    if(err) res.redirect("/error");

    if(docs.length > 0){
      User.find({'email': docs[0].email}, (err, usr) => {
        if(err) res.redirect("/error");

        if(usr.length > 0){
          usr[0].password = req.body.password;
          usr[0].save(err => {
            if(err) res.redirect("/error");

            PasswordReset.deleteOne({'resetCode': req.body.code}, (err) => {
              if(err) res.redirect("/error");

              res.redirect("/login");
            });
          });
        } else {
          // No Such User
          res.redirect("/error");
        }
      });
    } else {
      // Password Reset does not Exist
      res.redirect("/error");
    }
  });
});

function sendEmail(mailoptions){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS
    }
  });

  transporter.sendMail(mailoptions, (err, info) => {
    if(err) throw err;
  });
}

module.exports = router;
