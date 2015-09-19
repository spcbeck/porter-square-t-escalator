var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');

var Entry = mongoose.model('Entry');
var Status = mongoose.model('Status');
var router = express.Router();


var status = JSON.parse(fs.readFileSync('./config.json', 'utf8'));


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

router.get('/status', function(req, res, next) {
	res.json(status);
});

router.put('/status', function(req, res, next) {
	status.status = !status.status;
	fs.writeFile('./config.json', JSON.stringify(status, null, 2), function(err) {

	})
});

router.post('/status', function(req, res, next) {
	var initialStatus = new Status(req.body);

	initialStatus.save(function(err, status) {
		if(err) { return next(err); }

		res.json(status);
	});
});


module.exports = router;
