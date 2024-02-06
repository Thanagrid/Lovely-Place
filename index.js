//import module
const express = require('express');                                 //import express
const app = express();
const path = require('path');                                       //import path
const cookieParser = require('cookie-parser');                      //import cookie-parser
const loginRouter = require('./routes/loginRouter');                //import loginRouter
const router = require('./routes/router');                          //import Main router
const editNamePassRouter = require('./routes/editNamePassRouter');  //import change name password router
const postRouter = require('./routes/post');                        //import post router

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
app.use(loginRouter); //loginRouter
app.use(router); //main router
app.use(editNamePassRouter); // change name password router
app.use(postRouter); // post router

//port
const port = 8080;
app.listen(port,()=>{
    console.log(`--->> Server run on port:${port}`);
});
