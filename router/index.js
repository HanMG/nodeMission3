var express = require('express')
var app = express()
var router = express.Router()
var main = require('./main/index')
var join = require('./join/index')
var login = require('./login/index')
var logout = require('./logout/index')

router.use('/',main)
router.use('/join',join)
router.use('/login',login)
router.use('/logout',logout)

module.exports = router;