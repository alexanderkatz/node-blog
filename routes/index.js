module.exports = function(app, passport){

	var express = require('express');
	// var router = express.Router();
	
// Function to print key/val pairs
function getKeys(obj){
    var keys = [];
    for(var key in obj){
        keys.push(key);
        console.log(key+": "+obj[key]);
    }
    console.log("----------------------------");
}

	// Passport Auth ======================================================================

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function (req, res) {
		// If user is logged in redirect them to their blogroll
		if (isLoggedInBool(req)){
			// cannot hardcode address because port is included.
		    res.redirect(301, "http://www." + req.user.username + "." + process.env.DOMAIN);
		}
		console.log("User not logged in, render home");
		res.render('index', {
			title: 'Home',
			message: req.flash('errMessage')
		});
	});

	// =====================================
	// LOGIN ========
	// =====================================
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect: '/', // redirect back to the login page if error
		failureFlash: true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// process the login form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',	// redirect to the secure profile section
		failureRedirect : '/', 	// redirect back to signup page if there's an error
		failureFlash : true		// allow flash messages
	}));
	
	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req,res){
		// getKeys(req);
		console.log("req.cookies ----------------------------");
		getKeys(req.cookies);
		// console.log("req.headers ----------------------------");
		// getKeys(req.headers);


		// getKeys(req.session.cookie);
		res.render('profile',{
			title: 'Profile',
			user: req.user // get the user out of session and passed to template
		});
	});


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
	app.get('/', function (req, res) {
		// If user is logged in redirect them to their blogroll
		if (isLoggedInBool(req)){
			// cannot hardcode address because port is included.
		    res.redirect(301, "http://www." + req.user.username + process.env.DOMAIN);
		}
		console.log("User not logged in, render home");
		res.render('index', {
			title: 'Home'
		});
	});
// isLoggedInBool
// returns true or false
function isLoggedInBool(req){
	if (req.isAuthenticated()){
		return true;
	}
	return false;
}
// End of export
}