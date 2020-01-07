const express = require("express");
const cors = require("cors");
// const mysql = require("mysql");
const bodyParser = require("body-parser");
// const path = require('path')
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false });
const SELECET_ALL_PRODUCTS_QUERY = "SELECT * FROM lecture_videos";

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "@jinjub98",
//   database: "piano_tutoring"
// });

// connection.connect(err => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Connected to the MySQL server");
//   }
// });

app.use(express.static("public"));
app.use(cors());
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/tutors", (req, res) => {
  res.render("tutors");
});

app.get("/songs", (req, res) => {
  res.render("songs");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/community", (req, res) => {
  res.render("community");
});

app.get("/lectures/add", (req, res) => {
  const { tid, video_path } = req.query;
  const INSERT_LECTURES_QUERY = `INSERT INTO lecture_videos (tid, video_path) VALUES(${tid}, '${video_path}')`;
  connection.query(INSERT_LECTURES_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send("successfully added lecture");
    }
  });
});

app.get("/lectures", (req, res) => {
  connection.query(SELECET_ALL_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.post("/hello", (req, res) => {
  var user_email = req.body.user_email;
  var user_name = req.body.user_name;
  console.log(`user email: ${user_email}\n user name: ${user_name}`);
  const FIND_USER_QUERY = `SELECT user_email from user WHERE user_email='${user_email}'`;
  const INSERT_USER_QUERY = `INSERT INTO user (user_email, user_name) VALUES('${user_email}', '${user_name}')`;
  connection.query(FIND_USER_QUERY, (err, results) => {
    console.log(results);
    if (results) {
      return res.status(200).json({
        userdata: results
      });
    } else {
      connection.query(INSERT_USER_QUERY, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(404).send(err);
        } else {
          return res.status(200).json({
            userdata: results
          });
        }
      });
    }
  });
});

app.listen(4000, () => {
  console.log(`Young's server listening on port 4000`);
});
