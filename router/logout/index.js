var express = require('express')
var app = express()
var router = express.Router()

router.get('/',function(req,res){
    console.log('get logout js')
    req.logout()
    res.redirect('/login')
})

module.exports = router