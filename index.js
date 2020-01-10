const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const bodyParser = require("body-parser");
const path = require("path");
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

const connection = mysql.createConnection({
  host: "localhost",
  user: "young",
  password: "pianotutoring",
  database: "piano_tutoring"
});

connection.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the MySQL server");
  }
});

let login_state = false;
let user_email;
let user_name;

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
    if (results.length) {
      // 데이터베이스에 등록된 사용자
      console.log("이미 등록된 사용자");
      return res.status(200).json({
        userdata: results
      });
    } else {
      // 새로운 사용자
      console.log("new user!!");
      const INSERT_USER_QUERY = `INSERT INTO user (user_email, user_name) VALUES('${req.session.user_email}', '${req.session.user_name}')`;
      connection.query(INSERT_USER_QUERY, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(404).send(err);
        } else {
          console.log("inserted new user");
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
  const SELECT_TUTOR_INFO_QUERY = `SELECT * FROM tutor`;
  connection.query(SELECT_TUTOR_INFO_QUERY, (err, result) => {
    res.render("tutors", {
      login_state: req.session.logined,
      user_name: req.session.user_name,
      information: result
    });
  });
});

app.get("/tutors-profile", (req, res) => {
  const tid = req.query.tutor_id;
  const SELECT_TUTOR_MOREINFO_QUERY = `SELECT tutor_id,tutor_name,profile_image,long_description FROM tutor WHERE tutor_id='${tid}'`;
  connection.query(SELECT_TUTOR_MOREINFO_QUERY, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.render("tutors-profile", {
        login_state: req.session.logined,
        user_name: req.session.user_name,
        tutor_info: result
      });
    }
  });
});

app.post("/enroll_tutor", (req, res) => {
  const INSERT_ENROLL_TUTOR_QUERY = `INSERT INTO enroll_tutor(user_email, tutor_id) values ('${req.session.user_email}','${req.body.tid}');`;
  connection.query(INSERT_ENROLL_TUTOR_QUERY, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      return res.status(200).end();
    }
  });
});

app.get("/songs", (req, res) => {
  const SELECT_TUTOR_INFO_QUERY = `SELECT * FROM song`;
  console.log("GET songs 들어왔음");
  connection.query(SELECT_TUTOR_INFO_QUERY, (err, result) => {
    console.log(result);
    res.render("songs", {
      login_state: req.session.logined,
      user_name: req.session.user_name,
      information: result
    });
  });
});

app.get("/songs-profile", (req, res) => {
  const sid = req.query.song_id;
  const SELECT_SONG_MOREINFO_QUERY = `SELECT song_id,song_name,song_image,artist FROM song WHERE song_id='${sid}'`;
  connection.query(SELECT_SONG_MOREINFO_QUERY, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.render("songs-profile", {
        login_state: req.session.logined,
        user_name: req.session.user_name,
        song_info: result
      });
    }
  });
});

app.post("/enroll_song", (req, res) => {
  const INSERT_ENROLL_SONG_QUERY = `INSERT INTO enroll_song(user_email, song_id) values ('${req.session.user_email}','${req.body.sid}');`;
  connection.query(INSERT_ENROLL_SONG_QUERY, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      return res.status(200).end();
    }
  });
});

app.get("/userRoom", (req, res) => {
  res.render("userRoom", {
    login_state: req.session.logined,
    user_name: req.session.user_name
  });
});

app.get("/community", (req, res) => {
  const SELECT_POST_THUMBNAIL_QUERY = `SELECT post_id,title,description,user_name FROM posting LEFT JOIN user ON posting.user_email = user.user_email;`;
  connection.query(SELECT_POST_THUMBNAIL_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      res.render("community", {
        login_state: req.session.logined,
        user_name: req.session.user_name,
        posting: results
      });
    }
  });
});

app.get("/lecture-playing", (req, res) => {
  res.render("lecture-playing", {
    login_state: req.session.logined,
    user_name: req.session.user_name
  });
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
  const SELECET_ALL_PRODUCTS_QUERY = "SELECT * FROM lecture_videos";
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

app.listen(80, () => {
  console.log(`Young's server listening on port 80`);
});
