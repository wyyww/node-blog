let path = require('path');
let fs = require('fs');
let express = require('express');
let User = require('../models/User.js')

//用来监听URL为/api开头的请求
var router = express.Router();


//统一返回格式
var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: '',
    }
    next();
})
/**用户注册逻辑
 * 
 * 1，用户名不能为空
 * 2，密码不能为空
 * 3，两次输入密码必须一致
 * 
 * 
 * 1，用户名是否已经注册
 *          数据库查询
 */
router.post('/user/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    console.log(req.body);

    if (username === '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if (password === '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if (password !== repassword) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经被注册了，如果数据库中已经存在同名，则该用户名已经被注册
    User.findOne({
        username: username
    }).then((userInfo) => {
        if (userInfo) {
            //表示数据库中又该记录
            responseData.code = 4;
            responseData.message = '用户名已经注册';
            res.json(responseData);
            return;
        }
        //保存用户数据到数据库中
        var user = new User({
            username: username,
            password: password
        });//不需要直接操作数据库，通过操作数据对象可以直接操作数据库

        return user.save();//promise,后面可以继续then
    }).then((newUserInfo)=>{
        responseData.message = "注册成功"
        res.json(responseData);
    })
})


module.exports = router;