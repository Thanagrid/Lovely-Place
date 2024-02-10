//import module
const { render } = require('ejs');
const express = require('express');
const router = express.Router();    // เรียกใช้ Router()
const mysql = require('mysql2');    //import mysql2
const multer = require('multer');   //import multer

//MySQL Connection
pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lovely_place', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:0
});

// serach results
router.post('/search', (req, res)=>{
    const key = '%'+req.body.search+'%';
    const sql_search = "SELECT * FROM posts WHERE post_title LIKE ? OR post_preDes LIKE ? OR post_descript LIKE ?;";
    pool.query(sql_search, [key, key, key], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.render('S_searchResults', {
                posts: results,
                searchResults: req.body.search, 
                userLoginID: req.cookies.user_id
            });
        }
    });
});

//export module router
module.exports = router;