var express = require('express')
var app = express()
var router = express.Router()
var mysql = require('mysql')
// 로그인을 위해
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

// 루트에 config라는 하위폴더를 만들고 모듈로 만들어 exports했고
var dbconfig = require('../../config/database.js')
// 이를 가지고 연결
var connection = mysql.createConnection(dbconfig)
connection.connect()

router.get('/',function(req,res){
    console.log('get join js')
    res.render('join.ejs')
})

// 세션을 저장하는 처리
passport.serializeUser(function(user, done) {
    console.log('passport session save : ', user.name)
    done(null, user.name)
})

passport.deserializeUser(function(name, done){
    console.log('passport session get name : ', name)
    done(null, name)
})

// 이메일이 존재하는지 구분
passport.use('local-join', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
}, function(req, email, password, done){
   var query = connection.query('select * from tbl_user where email = ?',[email], function(err,rows){
        console.log("1");
        if(err) return done(err);
        if(rows.length){
            console.log('existed user')
            return done(null, false, {'message': 'fail'})
        } else{
            var sql = {email: email, name: req.body.name, pw: password}
            var query = connection.query('insert into tbl_user set ?',sql,function(err,rows){
                return done(null, {'email': email, 'name': req.body.name})
            })
        }
   })
}
))

router.post('/',function(req, res, next){
    console.log("post join js");
    passport.authenticate('local-join', function(err,user,info){
        var responseData = {};
        if(err) res.status(500).json(err);
        if(user){
            responseData.result = "ok";
            return res.json(responseData);
        }else{
            return res.json(info.message);
        }
    })(req, res, next);
})

module.exports = router