let path = require('path');
let fs = require('fs');
let express = require('express');


//用来监听URL为/main开头的请求
var router = express.Router();

router.get('/',function(req,res,next){
    res.render("main/index");
})


module.exports = router;