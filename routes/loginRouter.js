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


// Login page
router.get('/login', (req,res)=>{
    res.render('login',{message:''});
});

// Login verify ตรวจสอบ username & password จาก req login.ejs
router.post('/login/verify', (req,res)=>{
    //ดึงข้อมูลจาก database เงื่อนไขตาม user_name & user_password ทีผู้ใช้ req มา
    const sql_poolUser = 'SELECT * FROM users WHERE user_name = ? AND user_password = ?;' 
    pool.query(sql_poolUser, [req.body.username, req.body.password], (err, results, fields)=>{
        if(err){ 
            console.log(err);
            res.status(500);
        }else{
            if(results.length == 0){        //ถ้าไม่มีข้อมูลในตาราง (ไม่มี user_name & user_password ตรงตามที่ผู้ใช้กรอก)
                res.render('login',{message: 'Your Username or password is incorrect.'}); // render login.ejs ใหม่ โดยส่งข้อความไปบอก
            }else{                          // ถ้ามีข้อมูล user_name & user_password ตรงตามที่ผู้ใช้กรอก
                res.cookie('user_id',results[0].user_id,{maxAge:3600000}); //เก็บ cookie user_id ไว้ ครึ่งชั่วโมง
                res.cookie('user_name',results[0].user_name,{maxAge:3600000});
                res.redirect('/');  //กลับไปที่ '/'
            };
        };
    });
});


// register page
router.get('/register', (req,res)=>{
    res.render('register',{message: ''});
});

// register verify รับ username & password จาก req registor.ejs
router.post('/register/verify', (req,res)=>{
    //ตรวจสอบว่ามี user_name นี้อยู่แล้วรึเปล่า (เหมือนตรวจสอบว่ามีคนใช้ username นี้ไปรึยัง)
    const sql_poolUser = 'SELECT * FROM users WHERE user_name = ?;'
    //ดึงข้อมูลจาก database เงื่อนไขตาม user_name ทีผู้ใช้ req มา
    pool.query(sql_poolUser, [req.body.username], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            if(results.length == 0){    //ถ้าไม่มีข้อมูลในตาราง (user_name ที่ผู้ใช้ต้องการสมัครใหม่ไม่ตรงกับที่มีอยู่แล้ว)
                // บันทึก user_name & user_password ลงตาราง
                const sql_insertUser = 'INSERT INTO users(user_name, user_password) VALUES(?, ?);'
                pool.query(sql_insertUser,[req.body.username, req.body.password], (err, results, fields)=>{
                    if(err){
                        console.log(err);
                        res.status(500);
                    }else{
                        res.redirect('/login'); //เมื่อบันทึกข้อมูลเสร็จแล้ว ส่งกลับไปยัง /login
                    }
                });
            }else{                      //ถ้ามีข้อมูลในตาราง (user_name ซ้ำกับที่มีอยู่แล้ว)
                res.render('register',{message: 'Sorry, this username is already in use.'}); //render regis.ejs ใหม่ โดยส่งข้อความไปบอก
            };
        };
    });
});


// Change Username page
router.get('/change_username', (req,res)=>{
    if(req.cookies.user_id){ //ตรวจสอบว่าเข้าระบบอยู่รึเปล่า
         // ดึง username เดิมไปใส่เป็นค่าเริ่มต้นในฟอร์ม
        res.render('change_username',{
            username : req.cookies.user_name,
            message: ''
        });
    }else{
        res.redirect('/login');
    }
});

//Change Username verify
router.post('/change_username/verify', (req, res)=>{
    const sql_poolUser = 'SELECT * FROM users WHERE user_name = ?;'
    // ตรวจสอบว่าชื่อผู้ใช้ซ้ำรึเปล่า
    pool.query(sql_poolUser, [req.body.username], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            if(results.length == 0){  //ถ้า user_name ไม่ซ้ำ
                // อัพเดต user_name ลงตาราง
                const sql_updateUsername = 'UPDATE users SET user_name = ? WHERE user_id = ?;'
                pool.query(sql_updateUsername,[req.body.username, req.cookies.user_id], (err, results, fields)=>{
                    if(err){
                        console.log(err);
                        res.status(500);
                    }else{
                         //เมื่ออัพเดตข้อมูลเสร็จแล้ว บันทึก cookie user_name ใหม่ แล้วส่งกลับไปยัง index
                        res.cookie('user_name',req.body.username,{maxAge:3600000}); 
                        res.redirect('/');
                    }
                });
            }else{  //ถ้า user_name ซ้ำ
                res.render('change_username',{
                    username : req.cookies.user_name,
                    message: 'Sorry, this username is already in use.'
                });
            };
        };
    });
});


// Logout 
router.get('/logout', (req,res)=>{
    res.clearCookie('user_id'); //ลบ cookie user_id
    res.redirect('/login')      // กลับไป /login
});


//export module router
module.exports = router;