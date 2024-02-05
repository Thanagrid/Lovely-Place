const { render } = require('ejs');
const express = require('express');
const router = express.Router();

// index page
router.get('/', (req,res)=>{
    if(req.cookies.user_id){    //ถ้ามี cookie user_id ให้ render index.ejs
        res.render('index');
    }else{                      //ถ้าไม่มีให้ไปที่ /login
        res.redirect('/login');
    };
});

module.exports = router;