require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const userRoute = require("./routes/User");
const notesRoute = require("./routes/Notes");
const todosRoute = require("./routes/Todos");

db = mysql.createConnection({
  host: "s7.cyber-folks.pl",
  port: "3306",
  user: "rumvgsauoa_wiktor",
  password: process.env.DATABASE_PASSWORD,
  database: "rumvgsauoa_todonotesDB",
});

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://todo-notes.wiktorrudzki.pl"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoute);
app.use("/api/notes", notesRoute);
app.use("/api/todos", todosRoute);

app.listen(3001);
