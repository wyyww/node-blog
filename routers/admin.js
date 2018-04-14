let path = require('path');
let fs = require('fs');
let express = require('express');
let User = require('../models/User')
let Category = require('../models/Category')
let Content = require('../models/Content')
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
router.get('/category', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    Category.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //page不能超过总页数 pages
        page = Math.min(page, pages)
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then(function (categories) {
            res.render("admin/category_index", {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                count: count,
                limit: limit,
                pages: pages,
            })
        })
    })
})
/**
 * 添加分类
 */
router.get('/category/add', function (req, res, next) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    })
})
/**
 * 分类添加的保存
 */
router.post('/category/add', function (req, res, next) {
    //当提交数据不符合要求会跳转到错误页面，否则展示页面
    var name = req.body.name || '';
    if (name === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }

    //数据库中是否已经存在同名分类名称
    Category.findOne({
        name: name
    })
        .then(function (rs) {
            if (rs) {
                //数据库中已经存在该分类了
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '分类已经存在'
                })
                return Promise.reject();//这一步Promise很经典啊
            }
            else {
                return new Category({
                    name: name,
                }).save();
            }
        }).then(function (newCategory) {
            //返回的promise，category
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '分类保存成功',
                url: '/admin/category'
            })
        })
})

/**
 * 修改分类
 */
router.get('/category/edit', function (req, res, next) {
    //获取需要修改的分类的信息,并且用表单形式展现出来
    var _id = req.query.id || '';
    //获取需要修改的分类信息
    Category.findOne({
        _id: _id
    }).then(function (category) {

        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在',
            })
            return Promise.reject();
        }
        else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category,
            })
        }
    })
})

/**
 * 修改分类的保存
 */
router.post('/category/edit', function (req, res, next) {
    var _id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';

    //获取需要修改的分类信息
    Category.findOne({
        _id: _id
    }).then(function (category) {

        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在',
            })
            return Promise.reject();
        }
        else {
            //当用户没有做任何修改提交的时候
            if (name === category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                })
                return Promise.reject();
            }
            else {
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: { $ne: _id },
                    name: name
                })
            }
        }
    })
        .then(function (sameCategory) {
            //数据库当中已经有同名分类
            if (sameCategory) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '数据库中存在同名分类',
                })
                return Promise.reject();
            }
            else {
                return Category.update({
                    _id: _id
                }, {
                        name: name
                    })
            }
        })
        .then(function () {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '修改成功',
                url: '/admin/category'
            })
        })


})

/**
 * 分类删除
 */
router.get('/category/delete', function (req, res, next) {
    var _id = req.query.id || '';
    //获取需要修改的分类信息
    Category.remove({
        _id: _id
    }).then(function (category) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        })
    })
})









//内容管理部分
/**
 * 内容首页
 */
router.get('/content', function (req, res) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    Content.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //page不能超过总页数 pages
        page = Math.min(page, pages)
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        //populate用来两个数据库进行关联查询,可以从另外一个表读取数据
        Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['category', 'user']).then(function (contents) {
            //console.log(contents);
            res.render("admin/content_index", {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                count: count,
                limit: limit,
                pages: pages,
            })
        })
    })
})

/**
 * 内容添加页面
 */
router.get('/content/add', function (req, res) {
    Category.find().sort({ _id: -1 }).then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories,
        })
    })
})
/**
 * 内容添加保存
 */
router.post('/content/add', function (req, res) {
    // console.log(req.body);
    if (req.body.category === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空',
        })
        return;
    }
    if (req.body.title === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空',
        })
        return;
    }
    //保存到数据库

    new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        user: req.userInfo._id.toString()
    }).save()
        .then(function (rs) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '内容保存成功',
                url: '/admin/content'
            })
        })
})


/**
 * 修改内容
 */
router.get('/content/edit', function (req, res) {
    var _id = req.query.id || '';

    var categories = [];
    Category.find().sort({ _id: -1 }).then(function (rs) {
        categories = rs;
        return Content.findOne({
            _id: _id
        }).populate('category')
    })
        .then(function (content) {
            if (!content) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '指定内容不存在',
                })
                return Promise.reject();
            }
            else {
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    content: content,
                    categories: categories,
                })
            }
        })
})
/**
 * 内容添加保存
 */
router.post('/content/edit', function (req, res) {
    // console.log(req.body);
    var _id = req.query.id || '';

    if (req.body.category === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空',
        })
        return;
    }
    if (req.body.title === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空',
        })
        return;
    }
    //保存到数据库
    Content.update({
        _id: _id
    }, {
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
        })
        .then(function (rs) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '内容保存成功',
                url: '/admin/content'
            })
        })
})

/**
 * 内容删除
 */
router.get('/content/delete', function (req, res, next) {
    var _id = req.query.id || '';

    Content.remove({
        _id: _id
    })
        .then(function () {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '删除内容成功',
                url: '/admin/content'
            })
        })
})
module.exports = router;