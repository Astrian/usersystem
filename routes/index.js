var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.uid == null) res.render('index');
  else res.redirect('/home')
});
router.get('/signup', function(req, res, next) {
  if (req.session.uid == null) res.render('signup');
  else res.redirect('/home')
});
router.get('/home', function(req, res, next) {
  if (req.session.uid == null) res.redirect('/');
  else res.render('home')
});
router.get('/console', function(req, res, next) {
  if (req.session.uid == null) res.redirect('/');
  else res.render('console')
});
router.get('/delaccount', function(req, res, next) {
  if (req.session.uid == null) res.redirect('/');
  else res.render('delaccount')
});
router.get('/logout', function(req, res, next) {
  if (req.session.uid == null) res.redirect('/');
  else res.render('logout')
});
module.exports = router;
