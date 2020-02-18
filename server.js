const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const csurf = require("csurf");
const nodemailer = require("nodemailer");

const User = require(path.join(__dirname, "/dbmodels/user"));
const EmailVerification = require(path.join(__dirname, "/dbmodels/emailVerification"));
const Product = require(path.join(__dirname, "/dbmodels/product"));
const Cart = require(path.join(__dirname, "/dbmodels/cart"));
const Order = require(path.join(__dirname, "/dbmodels/order"));
const Address = require(path.join(__dirname, "/dbmodels/address"));

const authRoute = require(path.join(__dirname, "/routes/auth"));
const mockapiRoute = require(path.join(__dirname, "/routes/mockapi"));
const infoRoute = require(path.join(__dirname, "/routes/info"));
const cartRoute = require(path.join(__dirname, "/routes/cart"));
const paymentRoute = require(path.join(__dirname, "/routes/payment"));
const userRoute = require(path.join(__dirname, "/routes/user"));

mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, "/static")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.post("/payment/notification", (req, res) => {
  if(req.headers.referer === "https://www.payfast.co.za" &&
     req.body.payment_status === "COMPLETE"){
       Cart.findById(req.body.custom_str1, (err, crt) => {
         if(err){
           console.log("ERROR!!");
           console.log(`Cart: ${req.body.custom_str} Not Found`);
           console.log("No Order Sent");
         } else {
           if(crt){
             var newOrder = new Order({
               'userID': crt.userID,
               'status': "Processing Payment",
               'products': crt.products,
               'total': crt.total
             });

             newOrder.save(err2 => {
               if(err2){
                 console.log("ERROR!!");
                 console.log(`Cart: ${req.body.custom_str} Could not be Transferred`);
                 console.log("No Order Sent");
               } else {
                 Cart.deleteOne({'_id': crt._id}, err3 => {
                   if(err3){
                     console.log("ERROR!!");
                     console.log(`Cart: ${req.body.custom_str} Could not be Transferred`);
                     console.log("No Order Sent");
                   } else {
                     // Send Order to Parcelninja
                     // Update Order Information
                   }
                 });
               }
             });
           } else {
             console.log("ERROR!!");
             console.log(`Cart: ${req.body.custom_str} Not Found`);
             console.log("No Order Sent");
           }
         }
       });

    /*

    router.post("/", (req, res) => {
      if(req.isAuthenticated()){
        Cart.findOne({'userID': req.session.passport.user}, (err, crt) => {
          if(err){
            res.redirect("/error");
          } else {
            if(crt){
              var newOrder = new Order({
                'userID': req.session.passport.user,
                'status': "requested",
                'products': crt.products,
                'total': crt.total
              });

              newOrder.save(err2 => {
                if(err2){
                  res.redirect("/error");
                } else {
                  Cart.deleteOne({'_id': crt._id}, err3 => {
                    if(err3){
                      res.redirect("/error");
                    } else {
                      res.redirect("/user");
                    }
                  });
                }
              });
            } else {
              res.redirect("/cart");
            }
          }
        });
      } else {
        res.redirect("/login");
      }
    });

    */
  } else {
    res.redirect("/error");
  }
  res.status(200).send("ok");
});

app.use(csurf());

app.use("/auth", authRoute);
app.use("/mockapi", mockapiRoute);
app.use("/info", infoRoute);
app.use("/cart", cartRoute);
app.use("/payment", paymentRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.status(200).render("holding");
});

app.get("/products", (req, res) => {
  res.status(200).render("products");
});

app.get("/register", (req, res) => {
  res.status(200).render("register", {csrfToken: req.csrfToken()});
});

app.get("/login", (req, res) => {
  res.status(200).render("login", {csrfToken: req.csrfToken()});
});

app.get("/verifyEmail", (req, res) => {
  EmailVerification.find({'verificationCode': req.query.code}, (err, vers) => {
    if(err){
      res.redirect("/error");
    } else {
      if(vers.length > 0){
        User.findOne({'email': vers[0].email}, (err2, user) => {
          if(err2){
            res.redirect("error");
          } else {
            user.verifiedEmail = true;
            user.save(err3 => {
              if(err3){
                res.redirect("/error");
              } else {
                EmailVerification.deleteOne({'verificationCode': req.query.code}, (err4) => {
                  if(err4){
                    res.redirect("/error");
                  } else {
                    res.render("emailVerification");
                  }
                });
              }
            });
          }
        });
      } else {
        res.redirect("/error");
      }
    }
  });
});

app.get("/landing", (req, res) => {
  if(req.isAuthenticated()){
    Product.find({}, (err, prds) => {
      if(err){
        res.redirect("/error");
      } else {
        var respac = {};
        respac.products = prds;
        respac.csrfToken = req.csrfToken();
        res.status(200).render("landing", respac);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/SPA", (req, res) => {
  res.status(200).render("SPA");
});

app.get("/learn_more", (req, res) => {
  res.status(200).render("information");
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("*", (req, res) => {
  res.render("notfound");
});

passport.serializeUser(function(uid, done){
  done(null, uid);
});

passport.deserializeUser(function(uid, done){
  done(null, uid);
});

app.listen(process.env.PORT);
