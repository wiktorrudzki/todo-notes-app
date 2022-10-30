require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;

db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_DATABASE_PASSWORD,
  database: "todonotes",
});

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    db.query(
      "SELECT * FROM users WHERE username = ?",
      username,
      (err, result) => {
        if (result.length > 0) {
          res.send({ message: "username already taken" });
        } else {
          const dbInsertUser =
            "INSERT INTO users (username, password) VALUES (?,?)";
          db.query(dbInsertUser, [username, hash], (err, result) => {
            console.log(err);
            res.send({ message: "user added to db" });
          });
        }
      }
    );
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (err, result) => {
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) res.send({ message: "logged in" });
          else res.send({ message: "wrong password" });
        });
      } else {
        res.send({ message: "didnt find a user" });
      }
    }
  );
});

app.listen(3001);
