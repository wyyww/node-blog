/**
 * 用户数据库构建 
 */
var mongoose = require('mongoose')



//内容的表结构
module.exports = new mongoose.Schema({
  //内容标题
  title:String,
  //关联字段,分类的is
  category:{
    //类型
    type:mongoose.Schema.Types.ObjectId,
    //引用,另一张表的模型
    ref:"Content"
  },
  //简介 
  description:{
      type:String,
      default:'',
  },

  //内容
  content:{
    type:String,
    default:''
  }
});