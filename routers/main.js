let path = require('path');
let fs = require('fs');
let express = require('express');

let Category = require('../models/Category')

//用来监听URL为/main开头的请求
var router = express.Router();

//第二个参数可以将内容分配
router.get('/',function(req,res,next){

    Category.find().then(function(categories){
        res.render("main/index",{
            userInfo:req.userInfo,
            categories:categories
        });
    })
   
})


module.exports = router;