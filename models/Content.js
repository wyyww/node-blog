
/**
 * 模型类，基于mongodb的表结构
 */
let mongoose = require('mongoose');
let contentSchema = require('../schemas/content');


//model类，用于对用户的数据表进行操作
module.exports  = mongoose.model('Content',contentSchema);