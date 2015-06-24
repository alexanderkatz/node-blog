var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET newpost. */
router.get('/newentry', function(req, res, next) {
  res.render('newentry-view', { title: 'New Post' });
});

/* GET blogroll. */
router.get('/blogroll', function(req, res, next) {
  res.render('blogroll-view', { title: 'Blog Roll' });
});

/* POST to entry. */
router.post('/postentry', function(req, res, next) {
});

module.exports = router;
