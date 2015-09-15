var express = require('express');
var mongoose = require('mongoose');

var Entry = mongoose.model('Entry');
var Status = mongoose.model('Status');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/entries', function(req, res, next) {
	Entry.find(function(err, entries){
	    if(err){ return next(err); }

	    res.json(entries);
	  });
});

router.post('/entries', function(req, res, next) {
	var entry = new Entry(req.body);

	entry.save(function(err, entry) {
		if(err) { return next(err); }

		res.json(entry);
	});
});


module.exports = router;
