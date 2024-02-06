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

//Change password page
router.get('/change_password', (req,res)=>{
    if(req.cookies.user_id){ //ตรวจสอบสถานะการเข้าสู่ระบบ
        res.render('change_password');
    }else{
        res.redirect('/login');
    };
});

//Change password update
router.post('/change_password/update', (req,res)=>{
    // อัพเดต password
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
});

module.exports = router;