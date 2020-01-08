const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const bodyParser = require("body-parser");
// const path = require('path')
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  session({
    secret: "piano",
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  })
);

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

// let login_state = false;
// let user_email;
// let user_name;

app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.render("index", {
    login_state: req.session.logined,
    user_name: req.session.user_name
  });
});

app.post("/", (req, res) => {
  req.session.logined = req.body.login_state;
  req.session.user_email = req.body.user_email;
  req.session.user_name = req.body.user_name;

  console.log(
    `login_state: ${req.session.logined}\n user email: ${req.session.user_email}\n user name: ${req.session.user_name}`
  );

  const FIND_USER_QUERY = `SELECT user_email FROM user WHERE user_email='${req.session.user_email}'`;
  connection.query(FIND_USER_QUERY, (err, results) => {
    console.log(results);
    if (results) {
      // 데이터베이스에 등록된 사용자
      return res.status(200).json({
        userdata: results
      });
    } else {
      // 새로운 사용자
      const INSERT_USER_QUERY = `INSERT INTO user (user_email, user_name) VALUES('${user_email}', '${user_name}')`;
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

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/tutors", (req, res) => {
  res.render("tutors", {
    login_state: req.session.logined,
    user_name: req.session.user_name
  });
});

app.get("/songs", (req, res) => {
  res.render("songs", {
    login_state: req.session.logined,
    user_name: req.session.user_name
  });
});

app.get("/userRoom", (req, res) => {
  res.render("userRoom", {
    login_state: req.session.logined,
    user_name: req.session.user_name
  });
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

app.listen(4000, () => {
  console.log(`Young's server listening on port 4000`);
});
