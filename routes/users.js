var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req,res){
    var db = req.db;
    var collection = db.get('userlist');

    collection.find({},{}, function (e,docs) {
        res.json(docs);
    });
});

/* POST new user to db */
router.post('/insertuser', function(req,res){
	var db=req.db;
	var collection = db.get('userlist');

	collection.insert(req.body, function(err,result){
		res.send(
			(err===null) ? {msg: ''} : {msg: err}
		);
	});		
});

// DELETE a user from the db
router.delete('/deleteuser/:id', function(req,res){
    console.log(req.params.id);
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


module.exports = router;
