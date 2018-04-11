/**
 * 程序入口文件
 */

 //加载express模块
 var express = require('express');
 //创建app应用 => NodeJs HTTP.createServer();
 var app = express();


 //根据访问的类型和访问的URL路径，分类进行处理
 app.get('/',function(req,res,next){
     console.log(res)
     res.send("欢迎访问我的博客");
 })


 //监听http请求
 app.listen(8081);

 //http://localhost:8081/