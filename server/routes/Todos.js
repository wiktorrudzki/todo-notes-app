const express = require("express");
const { verifyJWT } = require("../middlewares/verifyToken");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.delete("/", verifyJWT, (req, res) => {
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

router.post(
  "/add",
  verifyJWT,
  body("category").isLength({ max: 55 }),
  (req, res) => {
    const position = req.body.position;
    const category = req.body.category;
    const date = req.body.date;
    const progress = req.body.progress;
    const text = req.body.text;
    const userId = req.userId;

    const today = new Date();
    today.setDate(today.getDate() - 1);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ added: false, message: errors.errors[0].msg });
    }

    if (!(new Date(date) > today)) {
      return res.json({ added: false, message: "incorrect date" });
    }

    db.query(
      "INSERT INTO todos (todo_category, todo_date, todo_progress, todo_text, user_id, todo_position) VALUES (?, ?, ?, ?, ?, ?)",
      [category, date, progress, text, userId, position],
      (err, result) => {
        if (err) {
          res.json({ added: false, message: "error while adding todo" });
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
  }
);

router.get("/", verifyJWT, (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.json({ message: "failed" });
  }

  db.query("SELECT * FROM todos WHERE user_id = ?", userId, (err, result) => {
    if (result && result.length > 0) {
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

router.patch("/changeProgress", verifyJWT, (req, res) => {
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

router.patch("/updateIndex", verifyJWT, (req, res) => {
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

module.exports = router;
