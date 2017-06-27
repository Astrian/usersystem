var express = require('express')
var router = express.Router()
var DB = require('./class/db')
var sync = require('sync_back').run
var debug = require('debug')('wolf:api')
var bcrypt = require('bcrypt');
const salt = '$2a$10$ORFLdFF6NLIDfZ3x2ywwfu'

// 登录
router.post('/login', function (req, res, next) {
  if (req.session.uid != null) return backFail(res, 400, -1, '已经登录。若需切换帐户，请先登出当前用户。')
  if (checkArg(req, res, ['password', 'username'])) return backFail(res, 400, -1, '有必填项未填写')
  sync(function* (api){
    var post = req.body
    var password = post.password
    var username = post.username
    var dbdata = yield DB.read('SELECT * FROM account WHERE username = "'+ username+'"', api.next)
    if (api.err) console.log(api.err)
    if (dbdata.length == 0) return backFail(res, 400, -1, '用户名不存在。')
    password = yield bcrypt.hash(password, salt, api.next);
    if(password != dbdata[0].password) return backFail(res, 400, -1, '帐户密码不正确。')
    req.session.uid = dbdata[0].id
    backSuccess(res)
  })
})

// 注册
router.post('/signup', function (req, res, next) {
  if (req.session.uid != null) return backFail(res, 400, -1, '已经登录。若需切换帐户，请先登出当前用户。')
  if (checkArg(req, res, ['email', 'password', 'username'])) return backFail(res, 400, -1, '有必填项未填写')
  sync(function* (api) {
    var post = req.body
    var email = post.email
    var password = post.password
    var username = post.username
    if (email.indexOf('@') == -1) return backFail(res, 400, -1, '邮箱格式不正确。')
    console.log('SELECT * FROM account WHERE email = "'+ email+'"')
    var dbdata = yield DB.read('SELECT * FROM account WHERE email = "'+ email+'"', api.next)
    if (api.err) console.log(api.err)
    if(dbdata.length != 0) return backFail(res, 400, -1, '邮箱已被注册。')
    var dbdata = yield DB.read('SELECT * FROM account WHERE username = "'+ username+'"', api.next)
    if (api.err) console.log(api.err)
    if(dbdata.length != 0) return backFail(res, 400, -1, '用户名已被注册。')
    password = yield bcrypt.hash(password, salt, api.next);
    yield DB.write('INSERT INTO account (username, email, password, type) VALUES ("'+username+'", "'+email+'", "'+password+'", 0)', api.next)
    backSuccess(res)
  })
})

// 获取当前用户信息
router.get('/myinfo', function(req, res, next){
  if (req.session.uid == null) return backFail(res, 400, -1, '尚未登录至系统。')
  sync(function* (api){
    var dbdata = yield DB.read('SELECT username, email, type, bio FROM account WHERE id = "'+ req.session.uid+'"', api.next)
    backSuccess(res, dbdata[0])
  })
})

// 修改资料（密码）
router.put('/modifyprofile', function (req, res, next) {
  if (req.session.uid == null) return backFail(res, 400, -1, '尚未登录至系统。')
  sync(function* (api){
    var post = req.body
    if (post.email && post.email != '') yield DB.write('UPDATE account SET email = "'+post.email+'" WHERE id = '+req.session.uid, api.next)
    if (post.username && post.username != '') yield DB.write('UPDATE account SET username = "'+post.username+'" WHERE id = '+req.session.uid, api.next)
    if (post.bio) yield DB.write('UPDATE account SET bio = "'+post.bio+'" WHERE id = '+req.session.uid, api.next)
    if (post.password && post.password != ''){
      var password = yield bcrypt.hash(post.password, salt, api.next);
      yield DB.write('UPDATE account SET password = "'+password+'" WHERE id = '+req.session.uid, api.next)
    }
    backSuccess(res)
  })
})

// 删除我的帐户
router.delete('/delmyaccount', function (req, res, next) {
  if (req.session.uid == null) return backFail(res, 400, -1, '尚未登录至系统。')
  sync(function* (api){
    yield DB.write('DELETE FROM account WHERE id = '+req.session.uid, api.next)
    req.session.uid = null
    backSuccess(res)
  })
})

// （管理员）删除某个用户的帐户
router.delete('/delspecificaccount', function(req, res, next){
  if (req.session.uid == null) return backFail(res, 400, -1, '尚未登录至系统。')
  if (checkArg(req, res, ['username'])) return backFail(res, 400, -1, '有必填项未填写')
  sync(function* (api){
    var dbResult = yield DB.read('SELECT type FROM account WHERE id = '+req.session.uid, api.next)
    if(dbResult[0].type != 1) return backFail(res, 400, -1, '当前登录用户不是管理员。')
    dbResult = yield DB.read('SELECT id FROM account WHERE username = "'+req.body.username+'"', api.next)
    if(dbResult.length == 0) return backFail(res, 400, -1, '用户名不存在。')
    yield DB.write('DELETE FROM account WHERE id = '+dbResult[0].id, api.next)
    backSuccess(res)
  })
})

// 退出登录
router.post('/logout', function (req, res, next) {
  req.session.uid = null
  backSuccess(res)
})

module.exports = router
function backFail(res, httpCode, errCode, errMes) {
    var r = {}

    r.success = false
    r.code = errCode
    r.data = errMes

    res.status(httpCode)
    res.send(r)
}
function backSuccess(res, data) {
    var r = {}

    r.success = true
    r.code = 0
    if (data != null)
        r.data = data

    res.status(200)
    res.send(r)
}
function isLogin(req) {
    if (req.session.uid != null)
        return true
    return false
}
function checkLogin(req, res) {
    if (isLogin(req))
        return false

    backFail(res, 401, -1, '未登录')
    return true
}
function checkArg(req, res, argArr) {
    var post = req.body
    for (var i of argArr) {
        if (post[i] == null) {
            backFail(res, 400, -1, '缺少参数:' + i)
            return true
        }
    }

    return false
}
