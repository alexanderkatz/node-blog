var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

/* GET newpost. */
router.get('/newentry', function (req, res, next) {
	res.render('newentry-view', {
		title: 'New Post'
	});
});

/* Get All Entries */
router.get('/blogroll', function (req, res, next) {
	var db = req.db;
	var entries = db.get('entrycollection');
	entries.find({},{}, function (e,docs) {
		res.render('blogroll-view', {
			title: 'All Posts',
			"entries" : docs
		});
	});
});


/* POST to entry. */
router.post('/postentry', function (req, res, next) {});

module.exports = router;