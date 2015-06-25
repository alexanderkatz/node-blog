var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

/* GET newpost. */
router.get('/newentry', function (req, res) {
	res.render('newentry-view', {
		title: 'New Post'
	});
});

/* Get All Entries */
router.get('/blogroll', function (req, res, next) {
	var db = req.db;
	var collection = db.get('entrycollection');
	collection.find({},{}, function (e,docs) {
		res.render('blogroll-view', {
			title: 'All Posts',
			"entries" : docs
		});
	});
});

/* POST to entry. */
router.post('/postentry', function (req, res) {
	var db = req.db;

	var entrytitle = req.body.entrytitle;
	var entrycontent = req.body.entrycontent;

	var collection = db.get('entrycollection');

	collection.insert({
		"entrytitle": entrytitle,
		"entrycontent": entrycontent
	}, function (err, doc){
		if (err) {
			// if it failed, return error
			res.send("Didn't add to database");
		} else {
			// forward to success page
			res.redirect("blogroll");
		}
	});
});

/* DELETE entry*/

module.exports = router;