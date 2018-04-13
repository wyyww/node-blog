let path = require('path');
let fs = require('fs');
let express = require('express');
let User = require('../models/User')
let Category = require('../models/Category')
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

    User.count().then(function (count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //page不能超过总页数 pages
        page = Math.min(page, pages)
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            // console.log(users);
            res.render("admin/user_index", {
                userInfo: req.userInfo,
                users: users,

                page: page,
                count: count,
                limit: limit,
                pages: pages,
            })
        })
    })

})

/**
 * 分类首页
 */
router.get('/category',function(req,res,next){

    res.render('admin/category_index',{
        userInfo: req.userInfo
    })
})

/**
 * 添加分类
 */
router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
        userInfo: req.userInfo
    })
})

/**
 * 分类添加的保存
 */
router.post('/category/add',function(req,res,next){
    //当提交数据不符合要求会跳转到错误页面，否则展示页面
   var name = req.body.name || '';
    if(name === ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message:'名称不能为空'
        });
        return;
    }
   
    //数据库中是否已经存在同名分类名称
    Category.findOne({
        name:name
    })
    .then(function(rs){
        if(rs){
            //数据库中已经存在该分类了
            res.render('admin/error',{
                userInfo: req.userInfo,
                message:'分类已经存在'
            })
            return Promise.reject();//这一步Promise很经典啊
        }
        else{
            return new Category({
                name:name,
            }).save();
        }
    }).then(function(newCategory){
         //返回的promise，category
        res.render('admin/success',{
            userInfo: req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        })
    })
})

module.exports = router;