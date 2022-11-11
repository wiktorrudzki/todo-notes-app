const express = require("express");
const { verifyJWT } = require("../middlewares/verifyToken");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.delete("/", verifyJWT, (req, res) => {
  const id = req.headers["id"];

  db.query("DELETE FROM notes WHERE id = ?;", id, (err, result) => {
    if (err) {
      res.json({ deleted: false, message: "error while deleting" });
    } else {
      res.json({ deleted: true, message: "succesfully deleted" });
    }
  });
});

router.delete("/deleteNotes", verifyJWT, (req, res) => {
  let notes = req.headers["notes"];
  notes = notes.split(",");

  notes.map((note) => {
    db.query("DELETE FROM notes WHERE id = ?;", note, (err, result) => {
      if (err) {
        return res.json({
          deleted: false,
          message: "error while deleting - not all marked notes are deleted",
        });
      }
    });
  });
  res.json({ deleted: true, message: "succesfully deleted" });
});

router.post(
  "/add",
  verifyJWT,
  body("title").isLength({ max: 55 }),
  (req, res) => {
    const title = req.body.title;
    const text = req.body.text;
    const userId = req.userId;
    const position = req.body.position;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ added: false, message: errors.errors[0].msg });
    }

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
  }
);

router.get("/", verifyJWT, (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.json({ message: "failed" });
  }

  db.query("SELECT * FROM notes WHERE user_id = ?", userId, (err, result) => {
    if (result && result.length > 0) {
      res.json({
        message: "well done",
        data: result,
      });
    } else {
      res.json({ message: "no data" });
    }
  });
});

router.patch("/changeColor", verifyJWT, (req, res) => {
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

module.exports = router;
