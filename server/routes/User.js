const express = require("express");
const jwt = require("jsonwebtoken");
const { verifyJWT } = require("../middlewares/verifyToken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const router = express.Router();

router.post(
  "/register",
  body("username").isLength({ min: 3, max: 55 }),
  body("password").isLength({ min: 4 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        created: false,
        message: "not valid length of username/password",
      });
    }

    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      return res.json({ created: false, message: "Passwords do not match" });
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
      db.query(
        "SELECT * FROM users WHERE username = ?",
        username,
        (err, result) => {
          if (result && result.length > 0) {
            res.json({ created: false, message: "username already taken" });
          } else {
            const dbInsertUser =
              "INSERT INTO users (username, password) VALUES (?,?)";
            db.query(dbInsertUser, [username, hash], (err, result) => {
              res.json({ created: true, message: "user added to db" });
            });
          }
        }
      );
    });
  }
);

router.get("/remember", verifyJWT, (req, res) => {
  const id = req.userId;

  if (!id) {
    return res.json({ auth: false, message: "didnt have user id" });
  }

  db.query("SELECT * FROM users WHERE id = ?", id, (err, result) => {
    if (result && result.length > 0) {
      res.json({
        auth: true,
        message: "welcome back",
        username: result[0].username,
        id: result[0].id,
      });
    } else {
      res.send({ auth: false, message: "didnt find a user" });
    }
  });
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (err, result) => {
      if (result && result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            const id = result[0].id;
            const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: 3600,
            });

            res.json({
              auth: true,
              message: "logged in",
              username: result[0].username,
              id: result[0].id,
              token: token,
            });
          } else
            res.send({
              auth: false,
              message: "wrong username/password combination",
            });
        });
      } else {
        res.send({
          auth: false,
          message: "wrong username/password combination",
          result: err,
        });
      }
    }
  );
});

module.exports = router;
