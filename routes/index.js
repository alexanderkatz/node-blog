module.exports = function(app, passport){

	var express = require('express');
	// var router = express.Router();



	/* Get All Entries */
	app.get('/blogroll', function (req, res, next) {
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
	app.get('/newpost', function (req, res) {
		res.render('newpost-view', {
			title: 'New Post'
		});
	});

	/* GET userlist. */
	app.get('/userlist', function (req, res) {
		res.render('userlist-view', {
			title: 'User List'
		});
	});


	/* POST to entry. */
	app.post('/insertpost', function (req, res) {
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
	app.delete('/deleteentry', function (req, res) {
		var db = req.db;
		// console.log("----------------------------");
		// console.log(req.body.entryid);
		var collection = db.get('entrycollection');
		collection.remove({ _id: req.body.entryid });
		res.send("delete endpoint hit");
	});

	// Passport Auth ======================================================================

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function (req, res) {
		res.render('index', {
			title: 'Home'
		});
	});
	// =====================================
	// LOGIN ========
	// =====================================
	app.get('/login', function (req, res) {
		res.render('login', {
			title: 'Login',
			// render the page and pass in any flash data if it exists
			message: req.flash('loginMessage')
		});
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req,res){
		res.render('signup',{
			title: 'Signup',
			// render the page and pass in any flash data if it exists
			message: req.flash('signUpMessage')
		});
	});

	// process the login form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',	// redirect to the secure profile section
		failureRedirect : '/signup', 	// redirect back to signup page if there's an error
		failureFlash : true		// allow flash messages
	}));
	
	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req,res){
		res.render('profile',{
			title: 'Profile',
			user: req.user // get the user out of session and passed to template
		});
	});
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('logout', function(req,res){
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req,res,next){
	// if user is authenticated in session carry on
	if (req.isAuthenticated()){
		return next();
	}
	//else redirect them to home page
	else{
		res.redirect('/');
	}
}
