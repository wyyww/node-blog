let path = require('path');
let fs = require('fs');
let express = require('express');
let User = require('../models/User')

//用来监听URL为/admin开头的请求
var router = express.Router();

/**
 * 首页
 */
router.get('/', function (req, res, next) {

    res.render("admin/index", {
        userInfo: req.userInfo
    })

})

/**
 * 用户管理
 */
router.get('/user', function (req, res, next) {
    /**
     * 从数据库中读取所有的用户数据
     * 分页：
     * 每页显示两条,利用URL的？查询条目实现分页
     * 1，一页限制两条,limit(Number)
     * 2,skip（），进行跳跃
     */
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    User.count().then(function(count){
        
        //计算总页数
        pages = Math.ceil(count / limit);
        //page不能超过总页数 pages
        page = Math.min(page,pages)
        //取值不能小于1
        page = Math.max(page,1);
        var skip = (page-1) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            // console.log(users);
            res.render("admin/user_index", {
                userInfo: req.userInfo,
                users: users,
    
                page:page,
                count:count,
                limit:limit,
                pages:pages,
            })
        })
    })
    
})

module.exports = router;