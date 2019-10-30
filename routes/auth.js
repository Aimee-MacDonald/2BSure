const express = require("express");
const router = express.Router();
const path = require("path");

const User = require(path.join(__dirname, "../dbmodels/user"));

router.post("/register", (req, res) => {
  var newUser = new User({
    'email': req.body.email,
    'password': req.body.password,
    'access': "user"
  });

  newUser.save(err => {
    if(err){
      res.send("Error Registering");
    } else {
      res.redirect("/user");
    }
  });
});

router.post("/login", (req, res) => {
  console.log("Auth Data:");
  console.log(req.body);
  res.redirect("/user");
});

module.exports = router;
