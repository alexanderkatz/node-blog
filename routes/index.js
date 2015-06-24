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

router.get('/blogroll', function (req, res, next) {
	var db = req.db;
	res.render('blogroll-view', {
		title: 'All Posts'
	});
});



//	var collection = db.get('entrycollection');
//	collection.find({}, {}, function (e, docs) {

//	})



/* POST to entry. */
router.post('/postentry', function (req, res, next) {});

module.exports = router;