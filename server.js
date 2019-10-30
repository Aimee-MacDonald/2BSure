const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const auth = require(path.join(__dirname, "/routes/auth"));

mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/static")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/auth", auth);

app.get("/", (req, res) => {
  res.status(200).render("holding");
});

app.get("/register", (req, res) => {
  res.status(200).render("register");
});

app.get("/login", (req, res) => {
  res.status(200).render("login");
});

app.get("/user", (req, res) => {
  res.status(200).render("user");
});

app.get("/admin", (req, res) => {
  res.status(200).render("admin");
})

app.listen(process.env.PORT, () => {console.log("Server started")});
