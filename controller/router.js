//var db =require("../models/db.js")
var db =require("../models/db.js")
var md5 =require("../models/md5.js")
var sd =require("silly-datetime");
var formidable=require("formidable");
var path =require("path");
var fs=require("fs");
var gm =require("gm");
exports.showIndex=function(req,res){
    //res.render("index",{"username":""})
    var username=req.session.uname;
    db.find("liuyan",{},{"sort":{"time":-1}},function(err,arr){
        if(err){
            console.log(err)
        }
        var d =fs.readdirSync("./avactor/change");
        console.log(d)
        if(arr!=[]){
            res.render("index",{"username":username,"liuyan":arr,"photos":d})
        }

    })
}
exports.showRegist=function(req,res){
    res.render("regist",{"dirnames":""})
}
exports.doRegist=function(req,res){
    //获取用户名 密码
    var uname= req.query.uname;
    var pwd= req.query.pwd;
    //将明文pwd转化为MD5
    pwd=md5(pwd);
    //入库
    db.find("web1704",{"uname":uname},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        if(result[0]==undefined){
            db.insertOne("web1704",{"uname":uname,"pwd":pwd},function(err,result){
                if(err){
                    console.log(err);
                    res.send("-1");
                }
                res.redirect("/")
            })
        }else if(uname==result[0].uname){
            res.render("regist",{"dirnames":"用户名被占用!"})

      }
    })
}
exports.login=function(req,res){
    res.render("login",{"log":""})
}
exports.doLogin=function(req,res){
    //获取用户名和密码 验证是否能登录成功
    var uname= req.query.uname;
    var pwd= req.query.pwd;
    pwd =md5(pwd)
    //根据用户名是否存在
    db.find("web1704",{"uname":uname},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        if(result.length==0){
            res.render("login",{"log":"用户名不正确"});
            return
        }

        //若用户存在
        var oldpwd =result[0].pwd;
        if(oldpwd==pwd){
            //密码正确 //登录成功记录登录的用户信息
            req.session.uname=result[0].uname;
            req.session.login="1";
            res.redirect("/");
        }else{
            res.render("login",{"log":"密码不正确"});
        }
    })
}
exports.back=function(req,res){
    req.session.uname=undefined;
    res.redirect("/")
    //res.render("index",{"username":""})
}
exports.fbly=function(req,res){
    var uname=req.session.uname;;
    var say= req.query.say;
    var time =sd.format(new Date(),"YYYY-MM-DD HH:mm:ss");
    db.insertOne("liuyan",{"uname":uname,"say":say, "time":time},function(err,result){
        if(err){
            console.log(err);
        }
        res.redirect("/")
    })
}
exports.user=function(req,res){
    var username=req.session.uname;
    db.find("liuyan",{"uname":username},{"sort":{"time":-1}},function(err,arr){
        if(err){
            console.log(err)
        }
        if(arr!=[]){
            res.render("user",{"username":username,"liuyan":arr})
        }
    })
}
exports.setAvatar=function(req,res){
    res.render("setAvatar")
}
exports.allss=function(req,res){
    var username=req.session.uname;
    res.redirect("/")
}
exports.setAvatar=function(req,res){
    var username=req.session.uname;
    res.render("setAvatar",{"username":username})
}
exports.touxiang=function(req,res){
    var username=req.session.uname;
    if(req.url=="/favicon.ico"){
        return
    }
    //根据请求作出处理
    if(req.url=="/touxiang"&&req.method.toLowerCase()=="post"){
        var form = new formidable.IncomingForm();
        //设置文件上传路径
        form.uploadDir="./avactor";
        //form 中的内容就会被分成2部分
        form.parse(req,function(err,fields,files){
            if(err){
                console.log(err)
                return;
            }
            var fname=files.file.name;
            var extname=path.extname(fname);
            //重命名 将uploads文件夹下面的名称改成time+ran+extname
            var old=files.file.path;
            var newpath="avactor/new/"+username+extname;
            fs.rename(old,newpath,function(err){
                if(err){
                    console.log(err);
                    return
                }
            });

            res.render("touxiang",{"username":username});
        });
    }
}
exports.doCut=function(req,res){
    var username=req.session.uname;
    var w=parseInt(req.query.w);
    var h=parseInt(req.query.h);
    var l=parseInt(req.query.l);
    var t=parseInt(req.query.t);
    //通过gm模块进行剪切

    gm("./avactor/new/"+username+".jpg").crop(w,h,l,t).write("./avactor/change/"+username+".jpg",function(err){
        if(err){
            console.log(err);
            res.send("剪切失败")
        }
        res.redirect("/")
    })
}