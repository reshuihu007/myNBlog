var mongoose = require('mongoose');
var config = require('../config');
// 自带的promise库指向，Promise库，在使用promise的时候要引用。
mongoose.Promise = Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.connect(config.dbUrl);
/*
    文档的_id 类型是 ObjectId

    主键是唯一的不重复的，不会被修改的，
    外键 别人家的主键，
*/
var UserSchema = new mongoose.Schema({
    username:String,
    password: String,
    email: String,
    avatar:String
});

exports.User = mongoose.model('User',UserSchema);
/*-----文章的模型------*/
var ArticleSchema = new mongoose.Schema({
    title:String, //文章标题
    content:String,  //正文
    user:{type:ObjectId,ref:'User'}, //  作者，
    createAt: Date   //发表时间
});
//定义模型
exports.Article = mongoose.model('Article',ArticleSchema);

