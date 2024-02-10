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
      res.render('P_newPost',{
         userLoginID: req.cookies.user_id
      });
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
         res.redirect('/'); //บันทึกเสร็จกลับไปที่หน้า index
      }
   });
});


//Post page
router.get('/post/:post_id', (req,res)=>{
   //ดึงข้อมูล post ตาม post_id (ได้จาก URL Parameter) เก็บไว้ใน results_post
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
            // ดึง user_name คนโพสต์ (โดยใช้ user_id ที่เก็บไว้ใน posts) เก็บไว้ใน results_post
            const sql_poolUser = 'SELECT user_name FROM users WHERE user_id = ?;'
            pool.query(sql_poolUser, [results_post[0].user_id], (err, results_user, fields)=>{
               if(err){
                  console.log(err);
                  res.status(200);
               }else{
                  // ส่งข้อมูล post และ username
                  res.render('P_post',{
                     postData: results_post[0], 
                     userData: results_user[0],
                     userLoginID: req.cookies.user_id
                  });
               }
            });
            
         }
      }
   });
});


//Manage post page
router.get('/manage_post', (req,res)=>{
   if(req.cookies.user_id){  //ตรวจสอบการเข้าสู่ระบบ
      // ดึง post จากโพสต์ที่มี user_id ตาม cookie user_id หรือ ตามการเข้าสู่ระบบ
       const sql_poolPost = "SELECT * FROM posts WHERE user_id = ?;"
       pool.query(sql_poolPost, [req.cookies.user_id], (err, results, fields)=>{
           if(err){
               console.log(err);
               res.status(500);
           }else{
               res.render('P_managePost',{
                  postData: results,
                  userLoginID: req.cookies.user_id
               });
           }
       });
   }else{
       res.redirect('/login');
   }
});


// Delete post
router.post('/manage_post/delete', (req,res)=>{
   // ลบโพสต์ตาม posts_id ที่ส่งมาจากปุ่มลบของโพสต์นั้นๆ 
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


// Edit post page
router.post('/manage_post/edit', (req,res)=>{
   // ดึงข้อมูลโพสต์ตาม posts_id ที่ส่งมาจากปุ่มแก้ไขของโพสต์นั้นๆ มาป็นค่า value (defualt) ในฟอร์ม edit post
   const sql_poolPost = 'SELECT * FROM posts WHERE post_id = ?;';
   pool.query(sql_poolPost, [req.body.post_id], (err, results, fields)=>{
       if(err){
           console.log(err);
           res.status(500);
       }else{
           res.render('P_editPost',{
            postData: results[0],
            userLoginID: req.cookies.user_id
         });
       }
   });
});


// update post
router.post('/manage_post/edit/update', (req,res)=>{
   //แก้ไขค่าต่างๆ ใน post ที่มี post_id ตรงกับที่ส่งมาจาก form
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


//export module router
module.exports = router;