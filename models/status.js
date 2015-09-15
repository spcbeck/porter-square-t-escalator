var mongoose = require('mongoose');

var StatusSchema = new mongoose.Schema({
	status: Boolean,
});

mongoose.model('status', StatusSchema);