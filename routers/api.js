let path = require('path');
let fs = require('fs');
let express = require('express');


//用来监听URL为/admin开头的请求
var router = express.Router();


//统一返回格式
var responseData;

router.use(function(req,res,next){
    responseData = {
        code:0,
        message:'',
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
router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    console.log(req.body);

    if(username === ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if(password === ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if(password !== repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    responseData.message = "注册成功"
    res.json(responseData);
    
})


module.exports = router;