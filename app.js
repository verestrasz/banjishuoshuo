var express=require("express");
var MongoClient=require("mongodb").MongoClient;
var session = require('express-session');
var router = require("./controller");
var gm =require("gm");
var app =express();
app.use(express.static("./public"));
app.use(express.static("./avactor"));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.listen(4000);
app.use(express.static("./public"));
app.set("view engine","ejs");
app.get("/",router.showIndex);
app.get("/regist",router.showRegist)
app.get("/doRegist",router.doRegist)
app.get("/login",router.login)
app.get("/doLogin",router.doLogin)
app.get("/back",router.back)
app.get("/fbly",router.fbly)
app.get("/user",router.user)
app.get("/setAvatar",router.setAvatar)
app.get("/allss",router.allss)
app.post("/touxiang",router.touxiang)
app.get("/doCut",router.doCut)