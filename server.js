const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("2BSure");
});

app.listen(8080, () => {console.log("Server started")});
