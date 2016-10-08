var express = require('express');
var path = require('path');
//引用bodyParser解析请求体，把请求体转成对象挂在req.body属性上
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var config = require('./config');
var user = require('./routes/user');
var article = require('./routes/article');
var index = require('./routes/index');

var app = express();
//public 作为静态文件根路径
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
//在博客中引入 ，cookie 和session
app.use(cookieParser());
app.use(session({
    secret: 'zfpx',
    resave: true,
    saveUninitialized: true,
    //指定session数据的存放位置
    store:new MongoStore({
        url:config.dbUrl
    })
}));
//设置模板引擎
app.set('view engine','html');
//设置模板的存放跟目录
app.set('views',path.join(__dirname,'views'));
//设置模板的渲染函数
app.engine('html',require('ejs').__express);

app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
});
//如果请求的路径以下面这个路径开头的话
app.use('/',index);
app.use('/user',user);
app.use('/article',article);

app.listen(8000, function () {
    console.log('port 8000!');
});