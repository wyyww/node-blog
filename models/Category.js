
/**
 * 模型类，基于mongodb的表结构
 */

var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');


//model类，用于对用户的数据表进行操作
module.exports  = mongoose.model('Category',categoriesSchema);