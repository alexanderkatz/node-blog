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

// GET a user's profile. This will accept any input
router.get('/:username', function(req, res){
  res.send("Hello Ms. "+req.vhost[0]);
});

router.get('/:username/profile', function(req, res){
  res.send("PROFILE:hi");
});


module.exports = router;
