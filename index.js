const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
// const path = require('path')
const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false } );
const SELECET_ALL_PRODUCTS_QUERY = 'SELECT * FROM lecture_videos';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@jinjub98',
    database: 'piano_tutoring'
});

connection.connect(err => {
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to the MySQL server');
    }
});
app.use(express.static('public'));
app.use(cors());
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/tutors', (req, res) => {
    res.render('tutors')
});

app.get('/songs', (req, res) => {
    res.render('songs')
});

app.get('/lectures/add', (req, res) => {
    const { tid, video_path } = req.query;
    const INSERT_LECTURES_QUERY = `INSERT INTO lecture_videos (tid, video_path) VALUES(${tid}, '${video_path}')`;
    connection.query(INSERT_LECTURES_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.send('successfully added lecture')
        }
    })
});

app.get('/lectures', (req, res) => {
    connection.query(SELECET_ALL_PRODUCTS_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json({
                data : results
            })
        }
    })
});

app.listen(4000, () => {
    console.log(`Young's server listening on port 4000`)
});