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


//create config multer
const configStorage = multer.diskStorage({
   destination: (req, file, cb)=>{
      cb(null, './public/img/posts'); // ตำแหน่งเก็บไฟล์ไฟล์
   },
   filename: (req, file, cb)=>{ // ตั้งชื่อไฟล์ด้วยเวลา + .jpg
      cb(null, Date.now()+'.jpg');
   }
})

//use multer to upload with configStorage
const multerUpload = multer({storage: configStorage})


// New post page
router.get('/new_post', (req,res)=>{
   // ตรวจสอบการเข้าสู่ระบบ
   if(req.cookies.user_id){
      res.render('new_post');
   }else{
      res.redirect('/login');
   }
});

// Upload new post
router.post('/new_post/upload', multerUpload.single('img'),(req,res)=>{
   //บันทึกลงตาราง posts
   const sql_insertNewpost = "INSERT INTO posts(post_title, post_preDes, post_descript, post_img, user_id) VALUES(?,?,?,?,?);";
   pool.query(sql_insertNewpost, [req.body.title, req.body.preDes, req.body.descript, req.file.filename, req.cookies.user_id], (err, results, fields)=>{
      if(err){
         console.log(err);
         res.status(500);
      }else{
         res.redirect('/'); //บันทึกเสร็จกลับไปทที่หน้า index
      }
   });
});


//Post page
router.get('/:post_id', (req,res)=>{
   //ดึงข้อมูล post ตาม post_id (ได้จาก URL Parameter)
   const sql_poolPost = 'SELECT * FROM posts WHERE post_id = ?;';
   pool.query(sql_poolPost, [req.params.post_id], (err, results_post, fields)=>{
      if(err){
         console.log(err);
         res.status(500);
      }else{
         // ถ้าไม่มีข้อมูล ส่งกลับไปยังหน้า index
         if(results_post.length == 0){ 
            res.redirect('/');
         }else{
            // ดึงชื่อคน post
            const sql_poolUser = 'SELECT user_name FROM users WHERE user_id = ?;'
            pool.query(sql_poolUser, [results_post[0].user_id], (err, results_user, fields)=>{
               if(err){
                  console.log(err);
                  res.status(200);
               }else{
                  // ส่งข้อมูล post และ username
                  res.render('post',{postData: results_post[0], userData: results_user[0]});
               }
            });
            
         }
      }
   });
});


//export module router
module.exports = router;