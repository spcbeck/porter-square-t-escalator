var mongoose = require('mongoose');

var EntrySchema = new mongoose.Schema({
	status: Boolean,
	comment: String,
	date: Date
});

mongoose.model('Entry', EntrySchema);