const express = require("express");
const router = express.Router();
const path = require("path");
const request = require('request');


const Order = require(path.join(__dirname, "../dbmodels/order"));
const User = require(path.join(__dirname, "../dbmodels/user"));

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    Order.find({'userID': req.session.passport.user}, (err, ords) => {
      if(err){
        res.redirect("/error");
      } else {
        var respac = {};
        if(ords){
          respac.orders = ords;
        } else {
          respac.orders = [];
        }

        res.status(200).render("user", respac);
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/admin", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, docs) => {
      if(err){
        res.redirect("/error");
      } else {
        if(docs.access === "admin"){
          res.status(200).render("admin", {csrfToken: req.csrfToken()});
        } else {
          res.redirect("/user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/admin/addStock", (req, res) => {
  if(req.isAuthenticated){
    request({
      method: 'POST',
      url: 'https://private-anon-e700df61f2-parcelninja.apiary-mock.com/api/v1/inbounds',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
      },
      body: "{  \"clientId\": \"PO-456789\",  \"typeId\": 1,  \"deliveryInfo\": {    \"customer\": \"My Supp\",    \"estimatedArrivalDate\": \"20140731\"  },  \"items\": [    {      \"itemNo\": \"Prod1232\",      \"name\": \"My Product1\",      \"imageURL\": \"http://myimg.co.za/img1\",      \"qty\": 2,      \"costPrice\": 12.5,      \"barcode\": \"1234567890\",      \"captureSerial\": false,      \"captureExpiry\": false    }  ]}"
    }, function (error, response, body) {
      console.log('Status:', response.statusCode);
      console.log('Headers:', JSON.stringify(response.headers));
      console.log('Response:', body);
      res.redirect("/user/admin/inbounds");
    });
  } else {
    res.redirect("login");
  }
});

router.get("/admin/inbounds", (req, res) => {
  if(req.isAuthenticated){
    res.status(200).render("inbounds");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
