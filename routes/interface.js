var express = require('express')
var router = express.Router()
var DB = require('./class/db')
var sync = require('sync_back').run
var debug = require('debug')('wolf:api')

router.post('/login', function (req, res, next) {
  
})
module.exports = router
