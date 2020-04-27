const express = require("express");
const router = express.Router();
const path = require("path");
const request = require('request');


const Order = require(path.join(__dirname, "../dbmodels/order"));
const User = require(path.join(__dirname, "../dbmodels/user"));
const Product = require(path.join(__dirname, "../dbmodels/product"));

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, (err, usr) => {
      if(err){
        res.redirect("/error");
      } else {
        console.log(usr);
        res.status(200).render("user");
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
  if(req.isAuthenticated()){
    request({
      method: 'GET',
      url: 'https://private-anon-e700df61f2-parcelninja.apiary-mock.com/api/v1/inbounds/?orderTypeId&startDate&endDate&pageSize&page&search&startRange&col&colOrder?startDate=20200101&endDate=20200303&pageSize=15&page=1',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
      }
    }, function (error, response, body) {
      var inbounds = JSON.parse(body).inbounds;
      var respac = {};
      respac.inbounds = [];
      for(var i = 0; i < inbounds.length; i++){
        respac.inbounds.push({
          'createDate': inbounds[i].createDate,
          'numItems': inbounds[i].numItems,
          'status': inbounds[i].status.description
        });
      }
      res.status(200).render("inbounds", respac);
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/admin/stock", (req, res) => {
  if(req.isAuthenticated()){
    request({
      method: 'GET',
      url: 'https://private-anon-e700df61f2-parcelninja.apiary-mock.com/api/v1/inventory/?pageSize&page&search',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
      }
    }, function (error, response, body) {
      var items = JSON.parse(body).items;
      var respac = {};
      respac.items = [];

      for(var i = 0; i < items.length; i++){
        respac.items.push({
          'name': items[i].name,
          'instock': items[i].instock
        });
      }

      res.status(200).render("stock", respac);
    });
  } else {
    res.redirect("/login")
  }
});

router.get("/admin/addProduct", (req, res) => {
  if(req.isAuthenticated()){
    res.status(200).render("addProduct", {csrfToken: req.csrfToken()});
  } else {
    res.redirect("/login");
  }
});

router.post("/admin/addProduct", (req, res) => {
  if(req.isAuthenticated()){
    var newProduct = new Product({
      'upc': req.body.upc,
      'sku': req.body.sku,
      'name': req.body.name,
      'description': req.body.description,
      'price': req.body.price,
      'inStock': req.body.inStock,
      'imageURL': req.body.imageURL
    });

    newProduct.save(err => {
      if(err){
        res.redirect("/error");
      } else {
        res.redirect("/user/admin/addProduct");
      }
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
