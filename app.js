/**
 * 程序入口文件
 */

 //加载express模块
 var express = require('express');
 var swig = require("swig");
 //创建app应用 => NodeJs HTTP.createServer();
 var app = express();


 /**
  * 配置应用模板引擎
  */
 //定义当前应用所使用的模板引擎
 //第一个参数：模板引擎的名称，同时也是模板文件的后缀;第二个参数表示用于解析处理模板内容的方法
 app.engine("html",swig.renderFile)
 //设置模板文件存放的目录，第一个参数必须为views，第二个参数是目录
 app.set("views","./views")
 //注册所使用的模板引擎,第一个参数必须是view engine,第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）一致的
 app.set("view engine",'html')
//为了避免开发过程中，模板从缓存中读取，需要取消模板缓存
swig.setDefaults({cache:false})

 /**
  * 首页
  * req request对象
  * res response对象
  * next 函数
  */
 //根据访问的类型和访问的URL路径，分类进行处理
 app.get('/',function(req,res,next){
    
    /**
     * 读取view目录下的指定文件，解析并返回给客户端
     * 第一个参数，表示模板的文件，相对于views目录，views/index.html
     * 
     * 第一次读取的时候会将读取的文件保存到内存中，因此第二次请求的时候会直接从内存中拿数据，则修改的模板不会返回到客户端； 性能提升
     */
    res.render('index');
    
    
    //res.send("欢迎访问我的博客");
 })


 //监听http请求
 app.listen(8081);

 //http://localhost:8081/