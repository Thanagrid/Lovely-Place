const { render } = require('ejs');
const express = require('express');
const router = express.Router();    // เรียกใช้ Router()
const mysql = require('mysql2');    //import mysql2

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

 //MySQL Connection Check
 pool.getConnection((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log(">> MySQL : Database Connecting...");
    }
 });

// Index page
router.get('/', (req,res)=>{
    // ดึงข้อมูลโพสต์ เรียงลำดับจากใหม่สุด
    const sql_poolPost = 'SELECT post_id, post_title, post_preDes ,post_img FROM posts ORDER BY post_id DESC;';
    pool.query(sql_poolPost, (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.render('index',{posts: results});
        }
   });
});

// Test menu page
router.get('/dev', (req,res)=>{
    res.render('test_menu');
})

module.exports = router;