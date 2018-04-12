
/**
 * 模型类，基于mongodb的表结构
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');


//model类，用于对用户的数据表进行操作
module.exports  = mongoose.model('User',usersSchema);