const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");

const User = require(path.join(__dirname, "../dbmodels/user"));

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
        'access': "user"
      });

      newUser.save(err => {
        if(err){
          res.send("Error Registering");
        } else {
          User.find({'email': req.body.email}, (err, docs) => {
            if(err) res.redirect("/error");

            req.login(docs[0]._id, (err) => {
              if(err) res.redirect("/error");
            });

            res.redirect("/user");
          });
        }
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

module.exports = router;
