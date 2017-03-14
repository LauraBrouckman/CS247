"use strict";

/*
 * Defined the Mongoose Schema and return a Model for a Photo
 */

/* jshint node: true */

var mongoose = require('mongoose');

/*
 * Photo can have comments and we stored them in the Photo object itself using
 * this Schema:
 */
var commentSchema = new mongoose.Schema({
    comment: String,     // The text of the comment.
    date_time: {type: Date, default: Date.now}, // The date and time when the comment was created.
    user_id: mongoose.Schema.Types.ObjectId,    // 	The user object of the user who created the comment.
});

// create a schema for Photo
var postSchema = new mongoose.Schema({
    id: String,     // Unique ID identifying this user
    article_pic_file: String,
    date_time: {type: Date, default: Date.now}, // 	The date and time when the photo was added to the database
    user_id: mongoose.Schema.Types.ObjectId, // The user object of the user who created the post.
    comments: [commentSchema], // Comment objects representing the comments made on this post.
	likes: [mongoose.Schema.Types.ObjectId],
	article_title: String,
	article_source: String,
	article_subtitle: String,
    profile_pic_file: String,
    bias_level: Number,
    article_slant: Number,
    url: String
});

// the schema is useless so far
// we need to create a model using it
var Post = mongoose.model('Post', postSchema);

// make this available to our photos in our Node applications
module.exports = Post;
