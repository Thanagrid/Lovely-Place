//import module
const express = require('express');
const router = express.Router();    // เรียกใช้ Router()
const mysql = require('mysql2');    //import mysql2
const multer = require('multer');   //import multer

// index page
router.get('/',(req,res)=>{
    res.status(200).send('Test index path');
});

//export module router
module.exports = router;