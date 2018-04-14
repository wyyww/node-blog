let path = require('path');
let fs = require('fs');
let express = require('express');

let Category = require('../models/Category')

let Content = require('../models/Content')

//用来监听URL为/main开头的请求
var router = express.Router();

/**
 * 首页展示
 */
router.get('/', function (req, res, next) {
    console.log(req.userInfo)
    var data = {
        page: Number(req.query.page || 1),
        limit: 2,
        pages: 0,
        count: 0,
        userInfo: req.userInfo,
        category:req.query.category || '',
        categories: [],
        contents: [],
    }

    var where = {};
    if(data.category){
        where.category = data.category
    }

    //读取分类信息
    Category.find().then(function (categories) {
        data.categories = categories;
        return Content.where(where).count();
    })
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
            .sort({addTime:-1});
        })
        .then(function (contents) {
            data.contents = contents;
            res.render("main/index", data);
        })

})


module.exports = router;