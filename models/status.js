var mongoose = require('mongoose');

var StatusSchema = new mongoose.Schema({
	status: { type: Boolean, default: false }
});

mongoose.model('Status', StatusSchema);