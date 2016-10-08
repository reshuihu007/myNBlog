var express = require('express');
var Article = require('../db').Article;
 //调用express Router方法可以得到一个路径的实例，它是一个路由的容器
var router = express.Router();
//真正的客户端请求的url= 路由前缀+ 此处的路由的路径
router.get('/', function (req,res) {
    // populate就是填充的意思，把某个属性从字段变成对象
    Article.find({}).populate('user').exec(function (err,docs) {
        //console.log(docs);
        res.render('index',{title:'首页',articles:docs});

    });
});
module.exports = router;