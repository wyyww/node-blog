/**
 * 程序入口文件
 */

 //加载express模块
 var express = require('express');
 //创建app应用 => NodeJs HTTP.createServer();
 var app = express();


 //监听http请求
 app.listen(8081);