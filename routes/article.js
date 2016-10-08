var express = require('express');
var Article = require('../db').Article;
var router = express.Router();
router.get('/add', function (req,res) {
    res.render('article/add',{title:'发表文章',article:{}});
    //res.send('发表文章');
});

/*
    保存文章
    1. 得到表单的内容，请求体保存到req.body
    2. req.body.createAt = new Date();
    3. req.body.user = 当前登录的用户的_id req.session.user._id
    4. 取得文章的Model，create方法保存次对象；
    5. 如果保存失败，则调回发表文章页面继续填写，如果保存失败跳转到首页
*/
router.post('/add', function (req,res) {
    var article = req.body;
    var _id = article._id;
    //console.log( article ,"article/add");
    if(_id){//如果把ID传过来了意味着是修改
        Article.update({_id},{
            $set:{
                title:article.title,
                content:article.content
            }
        },function(err,result){
            if(err){
                res.redirect('back');
            }else{
                res.redirect('/article/detail/'+_id);
            }
        });
    }else{
        //console.log(userId);
        article.createAt =new Date();
        //console.log(article);
        //把原来的空的_id删除掉，以便mongoose帮你自动生成一个新的ID
        delete article._id;
        article.user = req.session.user._id;
        Article.create(article, function (err,doc) {
            if(err){
                //console.error(err);
                //返回上一个页面
                res.redirect('back');
            } else{
                res.redirect('/');
            }
        });
    }
});

router.get('/detail/:_id', function (req,res) {
   Article.findById(req.params._id,function(err,doc){
       res.render('article/detail',{title:'文章详情',article:doc});
   }) ;
});

//删除文章/article/detele
router.get('/detele/:_id',function(req,res){

    Article.remove({_id:req.params._id},function(err,result){
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/');
        }
    });
});

router.get('/update/:_id', function (req,res) {
    //console.log(req.params);
    Article.findById(req.params._id, function (err,docs) {
//console.log(docs);
        res.render('article/add',{title:'编辑文章',article:docs});
    });
});

module.exports= router;
