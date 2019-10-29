const express = require("express");
const app = express();
require("dotenv").config();

app.get("/", (req, res) => {
  res.status(200).send("2BSure");
});

app.listen(process.env.PORT, () => {console.log("Server started")});
