const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true},
  verificationCode: {type: String, required: true}
});

module.exports = mongoose.model("emailVerification", schema);
