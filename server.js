const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/static")));

app.get("/", (req, res) => {
  res.status(200).render("holding");
});

app.listen(process.env.PORT, () => {console.log("Server started")});
