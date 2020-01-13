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

  if(user.isModified("password") || user.isNew){
    bcrypt.hash(user.password, bcrypt.genSaltSync(12), (err, hash) => {
      if(err) res.redirect("/error");
      user.password = hash;
      callback();
    });
  } else {
    callback();
  }
});

module.exports = mongoose.model("user", schema);
