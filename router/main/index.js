var express = require('express')
var app = express()
var router = express.Router()

router.get('/',function(req,res){
    console.log('get main js')
    var name = req.user;
    res.render('main.ejs',{'name':name})
})

module.exports = router