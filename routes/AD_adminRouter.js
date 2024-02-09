//import module
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


//Admin Management Page
router.get('/admin_management', (req,res)=>{
    if(req.cookies.user_id==1){ //ตรวจสอบความเป็น Admin จาก user_id ต้องมี id = 1
        res.render('AD_adminManage');
    }else{
        res.render('error');
    }
});


//Admin Post Manage
router.get('/admin_management/posts', (req,res)=>{
    if(req.cookies.user_id==1){ //ตรวจสอบความเป็น Admin
        // ดึงข้อมูลโพสต์ทั้งหมด
        const sql_poolPost = 'SELECT * FROM posts;';
        pool.query(sql_poolPost, (err, results, fields)=>{
            if(err){
                console.log(err);
                res.status(500);
            }else{
                res.render('AD_managePosts', {postData: results});
            }
        });
    }else{
        res.render('error');
    }
});


//Admin Post Delete
router.post('/admin_management/posts/delete', (req,res)=>{
    // ลบโพสต์ที่มี post_id ตรงกับที่ส่งมาจากปุ่มลบของ post นั้นๆ
    const sql_deletePost = 'DELETE FROM posts WHERE post_id = ?;';
    pool.query(sql_deletePost, [req.body.post_id], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.redirect('/admin_management/posts');
        }
    });
});


//Admin Users Manage
router.get('/admin_management/users', (req, res)=>{
    if(req.cookies.user_id==1){ //ตรวจสอบความเป็น Admin
        //ดึงข้อมูลของผู้ใช้ทั้งหมด ยกเว้น password!! 
        const sql_poolAllUsers = 'SELECT user_id ,user_name FROM users;';
        pool.query(sql_poolAllUsers, (err, results, fields)=>{
            if(err){
                console.log(err);
                res.status(500);
            }else{
                res.render('AD_manageUsers', {users: results});            
            }
        });
    }else{
        res.redirect('/');
    }
});


//Admin Users Delete
router.post('/admin_management/users/delete', (req, res)=>{
    // ลบผู้ใช้ที่มี user_id ตรงกับที่ส่งมาจากปุ่มลบของ user นั้นๆ
    const sql_deleteUser = 'DELETE FROM users WHERE user_id = ?;';
    pool.query(sql_deleteUser, [req.body.user_id], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.redirect('/admin_management/users');
        }
    });
});


module.exports = router;