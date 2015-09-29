var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var passport = require('passport');
var jwt = require('express-jwt');

var Entry = mongoose.model('Entry');
var User = mongoose.model('User');
var router = express.Router();

//TODO: secret should be set via environment variable
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var status = JSON.parse(fs.readFileSync('./config.json', 'utf8'));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/entries', function(req, res, next) {
	console.log("entries")
	Entry.find(function(err, entries){
	    if(err){ return next(err); }

	    console.log(entries);

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

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
