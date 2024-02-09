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


//report page
router.post('/report', (req,res)=>{
    if(req.cookies.user_id){
        res.render('RP_report', {post_id: req.body.post_id, user_id: req.cookies.user_id});
    }else{
        res.redirect('/login');
    }
});

//report sending
router.post('/report/send', (req, res)=>{
    const sql_insertReport = 'INSERT INTO reports(report_message, post_id, user_id) VALUES(?,?,?);'
    pool.query(sql_insertReport, [req.body.report_message, req.body.post_id, req.body.user_id], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.redirect(`/post/${req.body.post_id}`);
        }
    });
});

//report manage
router.get('/admin_management/report', (req, res)=>{
    if(req.cookies.user_id==1){
        const sql_poolReport = 'SELECT * FROM reports;';
        pool.query(sql_poolReport, (err, results, fields)=>{
            if(err){
                console.log(err);
                res.status(500);
            }else{
                res.render('RP_reportManage', {reportData: results});
            }
        });
    }else{
        res.redirect('/');
    }
});

//report - report delete
router.post('/admin_management/report/delete_report', (req,res)=>{
    const sql_deleteReport = "DELETE FROM reports WHERE report_id = ?;";
    pool.query(sql_deleteReport, [req.body.report_id], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.redirect('/admin_management/report');
        }
    });
});

//report - post delete
router.post('/admin_management/report/delete_post', (req,res)=>{
    const sql_deletePost = "DELETE FROM posts WHERE post_id = ?;";
    pool.query(sql_deletePost, [req.body.post_id], (err, results, fields)=>{
        if(err){
            console.log(err);
            res.status(500);
        }else{
            res.redirect('/admin_management/report');
        }
    });
});

 module.exports = router;