require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    res.send({ auth: false, message: "no token" });
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.post("/register", (req, res) => {
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
        if (result.length > 0) {
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
});

app.get("/todos", verifyJWT, (req, res) => {
  const userId = req.userId;

  db.query("SELECT * FROM todos WHERE user_id = ?", userId, (err, result) => {
    if (result.length > 0) {
      res.json({
        message: "well done",
        data: result,
        username: result[0].username,
        id: result[0].id,
      });
    } else {
      res.json({ message: "no data" });
    }
  });
});

app.get("/notes", verifyJWT, (req, res) => {
  const userId = req.userId;

  db.query("SELECT * FROM notes WHERE user_id = ?", userId, (err, result) => {
    if (result.length > 0) {
      res.json({
        message: "well done",
        data: result,
      });
    } else {
      res.json({ message: "no data" });
    }
  });
});

app.get("/rememberUser", verifyJWT, (req, res) => {
  const id = req.userId;

  db.query("SELECT * FROM users WHERE id = ?", id, (err, result) => {
    if (result.length > 0) {
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

app.post("/addTodo", verifyJWT, (req, res) => {
  const position = req.body.position;
  const category = req.body.category;
  const date = req.body.date;
  const progress = req.body.progress;
  const text = req.body.text;
  const userId = req.userId;

  db.query(
    "INSERT INTO todos (todo_category, todo_date, todo_progress, todo_text, user_id, todo_position) VALUES (?, ?, ?, ?, ?, ?)",
    [category, date, progress, text, userId, position],
    (err, result) => {
      if (err) {
        res.json({ added: false, message: "error while adding user" });
      } else {
        res.json({
          added: true,
          message: "todo added to db",
          category: category,
          date: date,
          progress: progress,
          text: text,
        });
      }
    }
  );
});

app.post("/addNote", verifyJWT, (req, res) => {
  const title = req.body.title;
  const text = req.body.text;
  const userId = req.userId;
  const position = req.body.position;

  

  db.query(
    "INSERT INTO notes (note_title, note_text, user_id, note_color, note_background, note_colors_index, note_position) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, text, userId, "#a57b44", "#ffffff", 0, position],
    (err, result) => {
      if (err) {
        res.json({ added: false, message: "error while adding note" });
      } else {
        res.json({
          added: true,
          message: "note added to db",
          title: title,
          text: text,
        });
      }
    }
  );
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
        });
      }
    }
  );
});

app.post("/changeNoteColor", verifyJWT, (req, res) => {
  const index = req.body.index;
  const color = req.body.color;
  const background = req.body.background;
  const id = req.body.id;

  db.query(
    "UPDATE notes SET note_colors_index = ?, note_color = ?, note_background = ? WHERE id = ?",
    [index, color, background, id],
    (err, result) => {
      if (err) {
        res.json({ changed: false, message: "error while changing colors" });
      } else {
        res.json({ changed: true, message: "succesfully changed colors" });
      }
    }
  );
});

app.post("/changeProgress", verifyJWT, (req, res) => {
  const id = req.body.id;
  const value = req.body.value;

  db.query(
    "UPDATE todos SET todo_progress = ? WHERE id = ?;",
    [value, id],
    (err, result) => {
      if (err) {
        res.json({ changed: false, message: "error while changing" });
      } else {
        res.json({ changed: true, message: "succesfully changed" });
      }
    }
  );
});

app.delete("/deleteTodo", verifyJWT, (req, res) => {
  const id = req.headers["id"];
  const position = req.headers["position"];
  const userId = req.userId;

  db.query("DELETE FROM todos WHERE id = ?;", id, (err, result) => {
    if (err) {
      res.json({ deleted: false, message: "error while deleting" });
    } else {
      db.query(
        "UPDATE todos SET todo_position = todo_position - 1 WHERE user_id = ? AND todo_position > ?;",
        [userId, position],
        (error) => {
          if (error) {
            res.json({ deleted: true, message: "error while updating index" });
          } else {
            res.json({ deleted: true, message: "succesfully deleted" });
          }
        }
      );
    }
  });
});

app.delete("/deleteNote", verifyJWT, (req, res) => {
  const id = req.headers["id"];

  db.query("DELETE FROM notes WHERE id = ?;", id, (err, result) => {
    if (err) {
      res.json({ deleted: false, message: "error while deleting" });
    } else {
      res.json({ deleted: true, message: "succesfully deleted" });
    }
  });
});

app.post("/updateIndex", verifyJWT, (req, res) => {
  const indexStart = req.body.indexStart;
  const indexEnd = req.body.indexEnd;
  const id = req.body.id;
  const userId = req.userId;

  if (indexStart < indexEnd) {
    db.query(
      "UPDATE todos SET todo_position = ? WHERE id = ? AND user_id = ?;",
      [indexEnd, id, userId],
      (err) => {
        if (err) {
          res.json({ changed: false, message: "error while changing index" });
        } else {
          db.query(
            "UPDATE todos SET todo_position = todo_position - 1 WHERE todo_position > ? AND todo_position < ? AND id != ? AND user_id = ?;",
            [indexStart, indexEnd + 1, id, userId],
            (error) => {
              if (error) {
                res.json({
                  changed: false,
                  message: "error while changing indexes",
                });
              } else {
                res.json({
                  changed: true,
                  message: "succesfully changed indexes",
                });
              }
            }
          );
        }
      }
    );
  } else {
    db.query(
      "UPDATE todos SET todo_position = ? WHERE id = ? AND user_id = ?;",
      [indexEnd, id, userId],
      (err) => {
        if (err) {
          res.json({ changed: false, message: "error while changing index" });
        } else {
          db.query(
            "UPDATE todos SET todo_position = todo_position + 1 WHERE todo_position < ? AND todo_position > ? AND id != ? AND user_id = ?;",
            [indexStart, indexEnd - 1, id, userId],
            (error) => {
              if (error) {
                res.json({
                  changed: false,
                  message: "error while changing indexes",
                });
              } else {
                res.json({
                  changed: true,
                  message: "succesfully changed indexes",
                });
              }
            }
          );
        }
      }
    );
  }
});

app.listen(3001);
