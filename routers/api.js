let path = require('path');
let fs = require('fs');
let express = require('express');


//用来监听URL为/admin开头的请求
var router = express.Router();

router.get('/user',function(req,res,next){
    res.send("api User");
})


module.exports = router;