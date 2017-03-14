"use strict";

/* jshint node: true */
/* global Promise */

/*
 * This Node.js program loads the CS142 Project #5 model data into Mongoose defined objects
 * in a MongoDB database. It can be run with the command:
 *     node loadDatabase.js
 * be sure to have an instance of the MongoDB running on the localhost.
 *
 * This script loads the data into the MongoDB database named 'cs142project6'.  In loads
 * into collections named User and Photos. The Comments are added in the Photos of the
 * comments. Any previous objects in those collections is discarded.
 *
 * NOTE: This scripts uses Promise abstraction for handling the async calls to
 * the database. We are not teaching Promises in CS142 so strongly suggest you don't
 * use them in your solution.
 *
 */

// Get the magic models we used in the previous projects.
var cs142models = require('./modelData/photoApp.js').cs142models;

// We use the Mongoose to define the schema stored in MongoDB.
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cs142project6');

// Load the Mongoose schema for Use and Photo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');
var Activity = require('./schema/activity.js');
var Post = require('./schema/post.js');

var versionString = '1.0';

// We start by removing anything that existing in the collections.
var removePromises = [User.remove({}), Photo.remove({}), SchemaInfo.remove({}), Activity.remove({}), Post.remove({})];

Promise.all(removePromises).then(function () {

    // Load the users into the User. Mongo assigns ids to objects so we record
    // the assigned '_id' back into the cs142model.userListModels so we have it
    // later in the script.

    var userModels = cs142models.userListModel();
    var userIDs = []; // Collect the fake IDs of the user we load
    var userPromises = userModels.map(function (user) {
        userIDs.push(user.id);
        return User.create({
            first_name: user.first_name,
            last_name: user.last_name,
            login_name: user.last_name.toLowerCase(),
            password: 'weak',
            bias_level: user.bias_level,
            profile_pic_file: user.profile_pic_file,
            cover_pic_file: user.cover_pic_file

        }, function (err, userObj) {
            if (err) {
                console.error('Error create user', err);
            } else {
                // Set the unique ID of the object. We use the MongoDB generated _id for now
                // but we keep it distinct from the MongoDB ID so we can go to something
                // prettier in the future since these show up in URLs, etc.
                userObj.id = userObj._id;
                userObj.save();

                user.objectID = userObj._id;
                console.log('Adding user:', user.first_name + ' ' + user.last_name, ' with ID ',
                    user.objectID);
            }
        });
    });


    var allPromises = Promise.all(userPromises).then(function () {
        // Once we've loaded all the users into the User collection we add all the photos. Note
        // that the user_id of the photo is the MongoDB assigned id in the User object.



        var postModels = cs142models.postListModel();
        var postPromises = postModels.map(function (post) {
            return Post.create({
                article_pic_file: post.article_pic_file,
                date_time: post.date_time, //  The date and time when the photo was added to the database
                user_id: post.user.objectID, // The user object of the user who created the post.
                article_title: post.article_title,
                article_source: post.article_source,
                article_subtitle: post.article_subtitle,
                profile_pic_file: post.user.profile_pic_file,
                bias_level: post.user.bias_level,
                url: post.url,
                article_slant: post.article_slant
            }, function (err, postObj) {
                if(err) {
                    console.error('Error create post', err);
                } else {
                    postObj.id = postObj._id;
                    postObj.save();
                }
            });
        });
       
        return Promise.all(postPromises).then(function () {
            // Create the SchemaInfo object
            return SchemaInfo.create({
                version: versionString
            }, function (err, schemaInfo) {
                if (err) {
                    console.error('Error create schemaInfo', err);
                } else {
                    console.log('SchemaInfo object created with version ', versionString);
                }
            });
        });
    });

    allPromises.then(function () {
        mongoose.disconnect();
    });
});
