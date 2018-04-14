let path = require('path');
let fs = require('fs');
let express = require('express');

let Category = require('../models/Category')

let Content = require('../models/Content')

//用来监听URL为/main开头的请求
var router = express.Router();


var data;
/**
 * 中间件处理通用数据
 */
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: [],
    }
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })
})
/**
 * 首页展示
 */
router.get('/', function (req, res, next) {
    // console.log(req.userInfo)
    // data = {
    //     page: Number(req.query.page || 1),
    //     limit: 2,
    //     count: 0,
    //     category: req.query.category || '',
    //     contents: [],
    // }
    data.page = Number(req.query.page || 1);
    data.limit = 2;
    data.count = 0;
    data.category = req.query.category || '';
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category
    }

    //读取分类信息
    // Category.find().then(function (categories) {

    //     return Content.where(where).count();
    // })
    Content.where(where).count()
        .then(function (count) {
            data.count = count;
            //计算总页数
            data.pages = Math.ceil(data.count / data.limit);
            //page不能超过总页数 pages
            data.page = Math.min(data.page, data.pages)
            //取值不能小于1
            data.page = Math.max(data.page, 1);
            let skip = (data.page - 1) * data.limit;

            return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user'])
                .sort({ addTime: -1 });
        })
        .then(function (contents) {
            data.contents = contents;
            res.render("main/index", data);
        })

})

/**
 * 阅读全文
 */
router.get('/view', function (req, res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        data.contents = content;
        //每次用户访问全文，则阅读数加1
        content.views++;
        content.save();
        
        res.render('main/view',data);
    })
})

module.exports = router;