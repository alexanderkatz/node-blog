var express = require('express');
var router = express.Router();

/* Manual Management of Users *********************************************************
***************************************************************************************
**************************************************************************************/

/* GET list of users for user table */
router.get('/userlist', function(req,res){
    var db = req.db;
    var collection = db.get('userlist');

    collection.find({},{}, function (e,docs) {
        res.json(docs);
    });
});

// DELETE a user from the db
router.delete('/deleteuser/:id', function(req,res){
    var db = req.db;
    var collection = db.get('userlist');

    var userToDelete = req.params.id;
    collection.remove({
        '_id': userToDelete
    }, function(err){
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );  
    });
});

// User App -----------------------------------

// GET a user's blogroll. This will accept any input
router.get('/:username', function(req, res, next){
    console.log("Viewing "+req.params.username+"'s blogroll");
    var db = req.db;
    var users = db.get('userlist');
    var collection = db.get('entrycollection');
    
    users.findOne({'username':req.params.username},{}, function (e,user) {
        // var userId = user._id;
        console.log("user id: "+user._id);

        collection.find({'userId' : user._id},{}, function (e,docs) {
            res.render('blogroll-view', {
                title: 'All Posts',
                "entries" : docs
            });
        });
    });
});

router.get('/:username/profile', function(req, res){
  res.send("PROFILE:hi");
});


module.exports = router;
