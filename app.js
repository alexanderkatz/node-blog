// set up ======================================================================
// get all the tools we need
var express = require('express');
var path = require('path');
var port = process.env.PORT || 8080;
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var vhost        = require('vhost');

var configDB = require('./config/database.js');
// Database
var mongo = require('mongodb');
var monk = require('monk');

// configuration ===============================================================

var db = monk(configDB.url);

require('./config/passport')(passport); // pass passport for configuration

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setup our express application ===============================================================
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// required for passport
app.use(session({secret:'hititwithacrayon'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session


// Make our db accessible to our router
// MUST BE ABOVE ROUTES
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Vhost code
var userApp = express();
userApp.set('views', path.join(__dirname, 'views'));
userApp.set('view engine', 'ejs');

var username;
userApp.use(function(req, res, next){
  // TODO: check to see that this username is valid
  // if not, 404 them.
  username = req.vhost[0]; // username is the "*" 
  // pretend request was for /{username}/* for file serving 
  req.originalUrl = req.url;
  req.url = '/users/' + username + req.url;
  console.log("Repackages user url: "+req.url); 
  next();
});

// userApp.get('/:username', function(req, res){
//   res.send("hello:hi");
// });

// userApp.get('/:username/profile', function(req, res){
//   res.send("PROFILE:hi");
// });

// userApp.use(serveStatic('public'));
app.use(vhost('*.pc.dev', userApp));
//----------------------------------------------

// Routes
require('./routes/index.js')(app, passport); //load our routes and pass in our app and fully configured passport
app.use('/users', users);

app.listen(port);
console.log('The magic happens on port ' + port);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
