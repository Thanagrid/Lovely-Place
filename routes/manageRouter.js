//import module
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

 //Manage post page
router.get('/manage_post', (req,res)=>{
    if(req.cookies.user_id){  //ตรวจสอบการเข้าสู่ระบบ
        const sql_poolPost = "SELECT * FROM posts WHERE user_id = ?;"
        pool.query(sql_poolPost, [req.cookies.user_id], (err, results, fields)=>{
            if(err){
                console.log(err);
                res.status(500);
            }else{
                res.render('manage_post', {postData: results});
            }
        });
    }else{
        res.redirect('/login');
    }
});

 // Delete post
router.post('/manage_post/delete', (req,res)=>{
    const sql_delelePost = 'DELETE FROM posts WHERE post_id = ?;';
    pool.query(sql_delelePost, [req.body.post_id], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.redirect('/manage_post');
        }
    });
});

 // Edit post
router.post('/manage_post/edit', (req,res)=>{
    const sql_poolPost = 'SELECT * FROM posts WHERE post_id = ?;';
    pool.query(sql_poolPost, [req.body.post_id], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.render('edit_post', {postData: results[0]});
        }
    });
});

 // update post
router.post('/manage_post/edit/update', (req,res)=>{
    const sql_updatePost = 'UPDATE posts SET post_title = ?, post_preDes = ?, post_descript = ? WHERE post_id = ?';
    pool.query(sql_updatePost, [req.body.title, req.body.preDes, req.body.descript, req.body.id], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.redirect('/manage_post');
        }
    });
});

 module.exports = router;