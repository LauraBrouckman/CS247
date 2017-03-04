"use strict";



/* jshint node: true */

var mongoose = require('mongoose');

// create a schema for Activity
var activitySchema = new mongoose.Schema({
	user_id: mongoose.Schema.Types.ObjectId,
	photo_filename: String,
	comment: String,
	activity_name: String,
	date_time: {type: Date, default: Date.now}
});

// the schema is useless so far
// we need to create a model using it
var Activity = mongoose.model('Activity', activitySchema);

// make this available to our activities in our Node applications
module.exports = Activity;
