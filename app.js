/**
 * 程序入口文件
 */

 //加载express模块
 let path = require('path');
 let fs = require('fs');
 let express = require('express');
 let swig = require("swig");
 let mime = require('mime');
 //创建app应用 => NodeJs HTTP.createServer();
 var app = express();


/**静态文件托管*/
//当用户访问的url，直接返回对应的__dirname + '/public'下的文件
app.use(express.static(path.join(__dirname, './public')));

 /**
  * 配置应用模板引擎
  */
 //定义当前应用所使用的模板引擎
 //第一个参数：模板引擎的名称，同时也是模板文件的后缀;第二个参数表示用于解析处理模板内容的方法
 app.engine("html",swig.renderFile)
 //设置模板文件存放的目录，第一个参数必须为views，第二个参数是目录
 app.set("views",path.join(__dirname,"views"))
 //注册所使用的模板引擎,第一个参数必须是view engine,第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）一致的
 app.set("view engine",'html')
//为了避免开发过程中，模板从缓存中读取，需要取消模板缓存
swig.setDefaults({cache:false})


/**
 * 根据不同的功能划分模块（首页可移到这里面了）
 * 
 */
app.use('/',require(path.join(__dirname ,'./routers/main')));
app.use('/admin',require(path.join(__dirname ,'./routers/admin')));
app.use('/api',require(path.join(__dirname , './routers/api')));

 /**
  * 首页
  * req request对象
  * res response对象
  * next 函数
  */
 /**根据访问的类型和访问的URL路径，分类进行处理
 app.get('/',function(req,res,next){
    
     * 读取view目录下的指定文件，解析并返回给客户端
     * 第一个参数，表示模板的文件，相对于views目录，views/index.html
     * 
     * 第一次读取的时候会将读取的文件保存到内存中，因此第二次请求的时候会直接从内存中拿数据，则修改的模板不会返回到客户端； 性能提升
     
    res.render('index');
 })
 */


 //监听http请求
 app.listen(8081);

 //http://localhost:8081/

 /**
  * 1，用户发送http请求  -》 URL  ->解析路由  -> 找到匹配的规则   ->  执行指定的绑定函数,返回给用户指定内容
  * 
  * 2，/public  -> 静态文件   ->直接读取目录下的文件,返回给用户
  * 
  * ->动态 -> 处理业务逻辑，加载模板，解析模板 ->返回数据给用户
  */