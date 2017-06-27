var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  //if (req.session.user == null)
  console.log('hello')
  res.render('index');
  //else res.redirect('/home')
});
module.exports = router;
