var express = require('express');
 //如果加载的是个文件夹，默认加载的是下面的index.js文件
var User = require('../db').User;

var multer = require('multer');
//dest 是从 app.js 就是启动服务为启点的路径
var upload = multer({dest:'public/uploads'})

 //调用express Router方法可以得到一个路径的实例，它是一个路由的容器
var router = express.Router();
//真正的客户端请求的url= 路由前缀+ 此处的路由的路径
router.get('/signup', function (req,res) {
    res.render('user/signup',{title:'注册'});
    //res.send('注册');
});
router.post('/signup', upload.single('avatar'),function (req,res) {
    //这个请求体对象的属性和表单的输入组件的name属性 一一对应
    var user = req.body;
    //console.log(req.body);
    //console.log(req.file);

    user.avatar =`/uploads/${req.file.filename}` ;
    User.create(user, function (err,doc) {
        if(err){
            res.send(err);
        }else {
            //res.send(user);
            //把保存成功之后的用户对象赋值给会话对象的user属性，
            //因为session是在服务器端存放的，所以把doc用户密码存放进去不危险，
            req.session.user = doc;
            //注册成功后会返回首页
            res.redirect('/');
        }
    });
});
/*提交登录表单
    1. 得到请求体对象，也就是序列化的表单对象转成的JS对象 bodyParser
    2. 以此对象作为条件，使用User模型对象到数据库中进行查询看是否符合条件的用户。
        如果有，则登录成功，把此用户写到session中，如果没有登录失败，返回登录页，让用户继续登录。*/
router.get('/signin', function (req,res) {
    res.render('user/signin',{title:'登录'});
   // var user = req.session.user;

    //res.send('登录');
});
router.post('/signin', function (req,res) {
    var user = req.body;
    //console.log(user);
    User.findOne(user, function (err,doc) {
        //console.log(doc);
        if(doc){
            req.session.user = doc;
            res.render('user/success',{title:'成功页'});
        }else{
            return res.redirect('/user/signin');
        }
    });
});

router.get('/signout', function (req,res) {
    //res.render('index',{title:'首页'});
    //res.send('退出')
    req.session = null; //退出将session 请空
    res.redirect('/');
});


module.exports = router;