var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router/index')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
// 오류 메시지 전달
var flash = require('connect-flash')

app.listen(3000,function(){
    console.log("start express server on port 3000")
})

// static소스 위치 설정
app.use(express.static('public'))

// bodyParser 설정 ( json형태, 인코딩되서온 형태 처리 )
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// view engine (template 설정)
app.set('view engine', 'ejs')

// express-session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(router)