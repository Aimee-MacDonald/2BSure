const express = require("express");
const router = express.Router();
const path = require("path");
const request = require('request');

const Order = require(path.join(__dirname, "../dbmodels/order"));
const User = require(path.join(__dirname, "../dbmodels/user"));
const Product = require(path.join(__dirname, "../dbmodels/product"));
const Address = require(path.join(__dirname, "../dbmodels/address"));

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    var respac = {};
    respac.csrfToken = req.csrfToken();

    Address.find({'userID': req.session.passport.user}, (err, adr) => {
      if(err){
        res.redirect("/error");
      } else {
        if(adr.length > 0){
          respac.firstname = adr[0].firstname;
          respac.lastname = adr[0].lastname;
          respac.number = adr[0].number;
          respac.street = adr[0].street;
          respac.city = adr[0].city;
          respac.postcode = adr[0].postcode;
          respac.province = adr[0].province;
        }

        res.status(200).render("user", respac);
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/address", (req, res) => {
  if(req.isAuthenticated()){
    Address.find({"userID": req.session.passport.user}, (err, adr) => {
      if(err){
        res.redirect("/error");
      } else {
        if(adr.length > 0){
          adr[0].firstname = req.body.firstname;
          adr[0].lastname = req.body.lastname;
          adr[0].number = req.body.number;
          adr[0].street = req.body.street;
          adr[0].city = req.body.city;
          adr[0].postcode = req.body.postcode;
          adr[0].province = req.body.province;

          adr[0].save(err2 => {
            if(err2){
              res.redirect("/error");
            }
          });
        } else {
          var newAddr = new Address({
            'userID': req.session.passport.user,
            'firstname': req.body.firstname,
            'lastname': req.body.lastname,
            'number': req.body.number,
            'street': req.body.street,
            'city': req.body.city,
            'postcode': req.body.postcode,
            'province': req.body.province
          });

          newAddr.save(err3 => {
            if(err3){
              res.redirect("/error");
            }
          });
        }
      }
    });

    res.redirect("/user");
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
