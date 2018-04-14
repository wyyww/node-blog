/**
 * 用户数据库构建 
 */
var mongoose = require('mongoose')



//内容的表结构
module.exports = new mongoose.Schema({
  //内容标题
  title: String,

  //关联字段,分类的关联
  category: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用,另一张表的模型
    ref: "Category"
  },
  //简介 
  description: {
    type: String,
    default: '',
  },

  //用户关联表
  user: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用,另一张表的模型
    ref: "User"
  },
  //时间
  addTime: {
    type: Date,
    default: new Date()
  },
  //阅读量
  views: {
    type: Number,
    default: 0
  },
  //内容
  content: {
    type: String,
    default: ''
  },
  //用来保存评论
  comments:{
    type:Array,
    default:[],
  }
  
});