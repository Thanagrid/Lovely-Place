//import module
const express = require('express');                                 //import express
const app = express();
const path = require('path');                                       //import path
const cookieParser = require('cookie-parser');                      //import cookie-parser
const router = require('./routes/router');                          //import Main router
const accountRouter = require('./routes/AC_accountRouter');         //import account router               
const postRouter = require('./routes/P_postRouter');                //import post router                  
const adminRouter = require('./routes/AD_adminRouter');             //import admin router
const searchRouter = require('./routes/S_searchRouter');            //import search router   
const reportRouter = require('./routes/RP_reportRouter');           //import report router   

// static & dynamic setup
app.use(express.static(path.join(__dirname,'public'))); // กำหนดที่อยู่ static file
app.set('views', path.join(__dirname,"views"));         // กำหนดที่อยู่ templates
app.set('view engine','ejs');                           // กำหนดให้ใช้ ejs

// body-parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());
// cookie-parser
app.use(cookieParser());
// router
app.use(router);                //main router
app.use(accountRouter);         //loginRouter
app.use(postRouter);            // post router
app.use(adminRouter);           // admin router
app.use(searchRouter);          // Search router
app.use(reportRouter);          // report router

//port
const port = 8080;
app.listen(port,()=>{
    console.log(`>> Server : run on port:${port}`);
});
