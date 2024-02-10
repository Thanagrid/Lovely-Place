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
    //ตรวจสอบการเข้าสู่ระบบ
    if(req.cookies.user_id){
        res.redirect('/');
    }else{
        res.render('AC_login',{
            message:'', 
            userLoginID: req.cookies.user_id
        });
    }
});


// Login verify ตรวจสอบ username & password
router.post('/login/verify', (req,res)=>{
    const sql_poolUser = 'SELECT * FROM users WHERE user_name = ? AND user_password = ?;' 
    pool.query(sql_poolUser, [req.body.username, req.body.password], (err, results, fields)=>{
        if(err){ 
            console.log(err);
            res.status(500);
        }else{
            if(results.length == 0){ //ถ้าไม่มี user_name & user_password ตรงตามที่ผู้ใช้กรอก render login.ejs แล้วส่งข้อความไปแจ้ง
                res.render('AC_login',{   
                    message: 'Your Username or password is incorrect.',
                    userLoginID: req.cookies.user_id
                });
            }else{                  // ถ้ามีข้อมูล user_name & user_password ตรงตามที่ผู้ใช้กรอก
                res.cookie('user_id',results[0].user_id,{maxAge:3600000}); //เก็บ cookie user_id ไว้ครึ่งชั่วโมง
                res.cookie('user_name',results[0].user_name,{maxAge:3600000});  //เก็บ cookie user_name ไว้ครึ่งชั่วโมง
                res.redirect('/');  //กลับไปที่ '/'
            };
        };
    });
});


// register page
router.get('/register', (req,res)=>{
    res.render('AC_register',{
        message: '',
        userLoginID: req.cookies.user_id
    });
});


// register verify รับ username & password จาก req registor.ejs
router.post('/register/verify', (req,res)=>{
    //ตรวจสอบว่ามี user_name นี้อยู่แล้วรึเปล่า (user_name ซ้ำ)
    const sql_poolUser = 'SELECT * FROM users WHERE user_name = ?;'
    pool.query(sql_poolUser, [req.body.username], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            if(results.length == 0){ //ถ้า user_name ที่ผู้ใช้ต้องการสมัครใหม่ไม่ซ้ำกับที่มีอยู่แล้ว)
                // ตรวจสอบว่ากรอกรหัสตรงกัน 2 ช่องมั้ย
                if(req.body.password == req.body.confirm_password){
                    const sql_insertUser = 'INSERT INTO users(user_name, user_password) VALUES(?, ?);'
                    pool.query(sql_insertUser,[req.body.username, req.body.password], (err, results, fields)=>{
                        if(err){
                            console.log(err);
                            res.status(500);
                        }else{
                            res.cookie('user_id',results[0].user_id,{maxAge:3600000}); //เก็บ cookie user_id ไว้ครึ่งชั่วโมง
                            res.cookie('user_name',results[0].user_name,{maxAge:3600000});  //เก็บ cookie user_name ไว้ครึ่งชั่วโมง
                            res.redirect('/'); 
                        }
                    });
                }else{
                    res.render('AC_register',{
                        message: 'Confirm passwords do not match.',
                        userLoginID: req.cookies.user_id
                    });
                }
            }else{ //ถ้ามี user_name ซ้ำกับที่มีอยู่แล้ว
                res.render('AC_register',{   
                        message: 'Sorry, this username is already in use.',
                        userLoginID: req.cookies.user_id  
                    }); 
            };
        };
    });
});


// Logout 
router.get('/logout', (req,res)=>{
    res.clearCookie('user_id'); //ลบ cookie user_id
    res.clearCookie('user_name') //ลบ cookie user_name
    res.redirect('/')      // กลับไป /login
});


// Change Username page
router.get('/change_username', (req,res)=>{
    if(req.cookies.user_id){ //ตรวจสอบว่าเข้าระบบอยู่รึเปล่า
         // ดึง username เดิมไปใส่เป็นค่าเริ่มต้นในฟอร์ม
        res.render('AC_changeUsername',{
            username : req.cookies.user_name,
            message: '',
            userLoginID: req.cookies.user_id
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
                res.render('AC_changeUsername',{
                    username : req.cookies.user_name,
                    message: 'Sorry, this username is already in use.',
                    userLoginID: req.cookies.user_id
                });
            };
        };
    });
});


//Change password page
router.get('/change_password', (req,res)=>{
    if(req.cookies.user_id){ //ตรวจสอบสถานะการเข้าสู่ระบบ
        res.render('AC_changePassword',{
            message: '',
            userLoginID: req.cookies.user_id
        });
    }else{
        res.redirect('/login');
    };
});


//Change password update
router.post('/change_password/update', (req,res)=>{
    // อัพเดต password
    if(req.body.password == req.body.confirm_password){
        const sql_updatePassword = "UPDATE users SET user_password = ? WHERE user_id = ?;"
        pool.query(sql_updatePassword, [req.body.password, req.cookies.user_id], (err, results, fields)=>{
            if(err){
                console.log(err);
                res.status(500);
            }else{ //เมื่ออัพเดตเสร็จสิ้น ลบ cookie user_id & user_name แล้วออกไปหน้า login
                res.clearCookie('user_id');
                res.clearCookie('user_name');
                res.redirect('/login')
            };
        });
    }else{
        res.render('AC_changePassword',{
            message: 'Confirm passwords do not match.',
            userLoginID: req.cookies.user_id
        });
    }
    
});

//export module router
module.exports = router;