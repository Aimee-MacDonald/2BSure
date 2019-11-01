const express = require("express");
const router = express.Router();
const path = require("path");

const User = require(path.join(__dirname, "../dbmodels/user"));

router.post("/register", (req, res) => {
  User.find({'email': req.body.email}, (err, docs) => {
    if(err) throw err;
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
            if(err) throw err;

            req.login(docs[0]._id, (err) => {
              if(err) throw err;
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
    if(err) throw err;

    if(docs.length > 0){
      if(req.body.password === docs[0].password){
        req.login(docs[0]._id, (err) => {
          if(err) throw err;
        });

        res.redirect("/user");
      } else {
        // Invalid Password
        res.redirect("/login");
      }
    } else {
      // No such User
      res.redirect("/login");
    }
  });
});

module.exports = router;
