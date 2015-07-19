var express = require('express');
var router = express.Router();

// Function to print key/val pairs
function getKeys(obj){
    var keys = [];
    for(var key in obj){
        keys.push(key);
        console.log(key+": "+obj[key]);
    }
    console.log("----------------------------");
}

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
    console.log("req.cookies ----------------------------");
    getKeys(req.cookies);
    // console.log("req.headers ----------------------------");
    // getKeys(req.headers);
    
    console.log("Viewing "+req.params.username+"'s blogroll");
    var db = req.db;
    var users = db.get('userlist');
    var collection = db.get('entrycollection');
    var view;
    console.log('req.isAuthenticated(): '+req.isAuthenticated());
    if (req.isAuthenticated()){
        view = 'admin-blogroll-view';
    } else {
        view = 'blogroll-view';
    }
    console.log("displaying view: "+view);
    users.findOne({'username':req.params.username},{}, function (e,user) {
        collection.find({'userId' : user._id},{}, function (e,docs) {
            res.render(view, {
                title: 'All Posts',
                "entries" : docs
            });
        });
    });
});

/* DELETE entry from blogroll */
router.delete('/:username/deleteentry', function (req, res) {
    var db = req.db;
    var collection = db.get('entrycollection');
    collection.remove({ _id: req.body.entryid });
    res.send("delete endpoint hit");
});

router.get('/:username/profile', function(req, res){
  res.send("PROFILE:hi");
});

module.exports = router;
