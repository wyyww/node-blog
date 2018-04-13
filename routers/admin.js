let path = require('path');
let fs = require('fs');
let express = require('express');
let User = require('../models/User')

//用来监听URL为/admin开头的请求
var router = express.Router();

/**
 * 首页
 */
router.get('/',function(req,res,next){
    
    res.render("admin/index",{
        userInfo:req.userInfo
    })
  
})

/**
 * 用户管理
 */
router.get('/user',function(req,res,next){
   //从数据库中读取所有的用户数据
    User.find().then(function(users){
        // console.log(users);
        res.render("admin/user_index",{
            userInfo:req.userInfo,
            users:users
        })
    })
})

module.exports = router;