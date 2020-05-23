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
    console.log('get login')
    //res.sendFile(path.join(__dirname,'../../public/join.html'))
    var msg;
    var errMsg = req.flash('error')
    if(errMsg) msg = errMsg;
    res.render('login.ejs',{'message':msg})
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
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback : true
}, function(req, email, password, done){
   var query = connection.query('select * from tbl_user where email = ? and pw = ?', [email,password], function(err,rows){
        if(err) return done(err)
        if(rows.length){
            return done(null, {'email': email, 'name':rows[0].name,'id': rows[0].uid})
        } else{
            return done(null, false, {'message':'이메일 또는 비밀번호를 다시 확인해주십시오.'})
        }
   })
}
))

router.post('/', function(req, res, next){
    passport.authenticate('local-login', function(err,user,info){
        if(err) res.status(500).json(err);
        if(!user) return res.json(info.message);

        req.logIn(user, function(err) {
              if (err) { return next(err); }
              return res.json(user);
        })
    })(req, res, next);
})

module.exports = router;