// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// load our db
var mongo = require('mongodb');
var monk = require('monk');
var configDB = require('./database.js');
var db = monk(configDB.url);

// expose this function to our app using module.exports
module.exports = function(passport){
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done){
        console.log("serializeUser***************************");
        done(null, user._id);
    });

    // use to deserialize the user
    passport.deserializeUser(function (id, done){
        console.log("deserializeUser*************************");
        var users = db.get('userlist');
        console.log("ID: "+id);
        users.findById(id, function(err, user){
            console.log('entered findById (user): '+user)
            // if there are any errors, return the error
            return done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, localStrategy uses username and password, we will override it with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true    // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done){
        // asynch
        // user findOne wont fire unless data is sent back
        process.nextTick(function(){
            // find a user whose email is the same as the form's email
            // we are checking to see if the user trying to login already exists

            // Our code ∆
            // get user collection
            var users = db.get('userlist');
            // TODO: should be 'local.email'
            users.findOne({'email' : email}, function(err, user){
                console.log('entered findOne (user): '+user)
                // if there are any errors, return the error
                if (err){
                    return done(err);
                }
                // check to see if there's already a user with that email
                if (user){
                    console.log("that email is already taken");
                    return done(null, false, req.flash('signupMessage', 'that email is already taken'));
                } else {
                    // if there is no user with that email
                    // ∆ create and insert a new user
                    newUser = {
                        'email': email,
                        'password': generatehash(password)
                    }
                    users.insert(newUser, function (err, user){
                        if (err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};

// password auth functions
function generatehash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function isValidPassword(password) {
    return bcrypt.compareSync(password, this.user.password);
}