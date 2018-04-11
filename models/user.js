
/**
 * 模型类，基于mongodb的表结构
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);