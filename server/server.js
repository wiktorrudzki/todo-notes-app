const express = require("express");
const mysql = require("mysql");

db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

const app = express();

app.use(express.json());

app.post("/register", (req, res) => {
  res.send(req.body);
});

app.post("/login", (req, res) => {
  res.send(req.body);
});

app.listen(3001);
