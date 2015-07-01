var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express'
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

/* GET newpost. */
router.get('/newpost', function (req, res) {
	res.render('newpost-view', {
		title: 'New Post'
	});
});

/* GET userlist. */
router.get('/userlist', function (req, res) {
	res.render('userlist-view', {
		title: 'User List'
	});
});


/* POST to entry. */
router.post('/insertpost', function (req, res) {
	console.log("insertpost");
	
	var db = req.db;

	var title = req.body.title;
	var content = req.body.content;

	var collection = db.get('entrycollection');

	collection.insert({
		"title": title,
		"content": content
	}, function (err, doc){
		if (err) {
			// if it failed, return error
			console.log("Didn't add to database");
			res.send("Didn't add to database");
		} else {
			// forward to success page
			console.log("Success!");
			res.redirect("blogroll");
		}
	});
});

/* DELETE entry*/
router.delete('/deleteentry', function (req, res) {
	var db = req.db;
	// console.log("----------------------------");
	// console.log(req.body.entryid);
	var collection = db.get('entrycollection');
	collection.remove({ _id: req.body.entryid });
	res.send("delete endpoint hit");
});

module.exports = router;