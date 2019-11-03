const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var schema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  access: {type: String, required: true},
  verifiedEmail: {type: Boolean, required: true}
});

schema.pre("save", function(callback){
  var user = this;
  bcrypt.genSalt(5, function(err, salt){
    if(err) res.redirect("/error");

    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) res.redirect("/error");
      user.password = hash;
      callback();
    });
  });
});

module.exports = mongoose.model("user", schema);
