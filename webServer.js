"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be implemented:
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require("fs");
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var Activity = require('./schema/activity.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
	if(!request.session.login_name) {
		response.status(401).send("No user logged in");
		return;
	}
	var query = User.find({});
	query.select('id first_name last_name');
	query.exec(function(err, users) {
		if(err) {
			response.status(400).send("Could not retrieve information from database");
		} else {
			response.end(JSON.stringify(users));
		}
	});
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
	if(!request.session.login_name) {
		response.status(401).send("No user logged in");
		return;
	}
	var id = request.params.id;
    User.findOne({_id: id}).select('id first_name last_name occupation location description').exec(function(err, user){
		if(err) {
			response.status(400).send(err.message);
		}
		else {
			response.end(JSON.stringify(user)); 
		}
	});
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
	if(!request.session.login_name) {
		response.status(401).send("No user logged in");
		return;
	}
	var id = request.params.id;
	Photo.find({user_id: id}, function(err, photos){
		if(err) {
			response.status(400).send(err.message);
			return;
		}
		var photosCopy = JSON.parse(JSON.stringify(photos));
		
		async.each(photosCopy, function(photo, callbackPhoto){
			async.each(photo.comments, function(comment, callbackComment) {
				User.findOne({_id: comment.user_id}).select('id first_name last_name').exec(function(err, commentUser){
					comment.user = commentUser;
					callbackComment();
					});
				}, function(err) {
					callbackPhoto();
				});
		}, function(err) {
			if(err) {
				response.status(400).send(err.message);
				return;
			} 
			response.end(JSON.stringify(photosCopy));
		});
	});
});

app.post('/admin/login', function(request, response) {
	var login = request.body.login_name;
	var pwd = request.body.password;
	if(!login || !pwd) {
		response.status(400).send("Login name or user");
		return;
	}
	User.findOne({login_name: login}, function(err, user) {
		if(err) {
			response.status(400).send(err.message);
			return;
		}
		if(user) {
			if(user.password !== pwd) {
				response.status(400).send("Invalid password");
				return;
			}
			request.session.login_name = user.login_name;
			request.session.user_id = user.id;
			response.status(200).send(JSON.stringify(user));
			return;
		}
		response.status(400).send("Invalid username");
		return;
	});
});

app.get('/admin/logout', function(request, response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to logout without logging in");
		return;
	}
	request.session.destroy(function(err) {
		if(err) {
			response.status(400).send(err.message);
			return;
		}
		response.status(200).send();
		return;
	});
});

app.post('/commentsOfPhoto/:photo_id', function(request, response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to comment without logging in");
		return;
	}
	var photoId = request.params.photo_id;
	var comment = request.body.comment;
	if(!comment) {
		response.status(400).send("comment is empty");
		return;
	}
	Photo.findOne({_id: photoId}, function(err, photo) {
		if(err) {
			response.status(400).send(err.message);
			return;
		}
		var newComment = {};
		newComment.comment = comment;
		newComment.date_time = Date.now();
		newComment.user_id = request.session.user_id;
		photo.comments.push(newComment);
		photo.save(function(err) {
			if(err) {
				console.log(err);
				response.status(400).send();
				return;
			}
			response.end(JSON.stringify(photo));
		});
	});
});

app.post('/user', function(request,response) {
	var login_name = request.body.login_name;
	var password = request.body.password;
	var first_name = request.body.first_name;
	var last_name = request.body.last_name;
	var location = request.body.location;
	var description = request.body.description;
	var occupation = request.body.occupation;
	if(!login_name || !first_name || !last_name) {
		response.status(400).send("Necessary field empty");
		return;
	}
	User.create({first_name: first_name, last_name: last_name, login_name: login_name, password: password, location: location, description: description,
		occupation: occupation}, doneCallback);

	function doneCallback(err, newUser) {
		if(err) {
			response.status(400).send(err);
			return;
		}
		newUser.id = newUser._id;
		newUser.save();
		console.log('Created object', newUser);
		response.end(JSON.stringify(newUser));
    }
});


app.post('/photos/new', function(request, response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to add photo without logging in");
		return;
	}
	processFormBody(request, response, function (err) {
		if (err || !request.file) {
            response.status(400).send("Could not process request");
            return;
        }
        var timestamp = new Date().valueOf();
        var filename = 'U' +  String(timestamp) + request.file.originalname;
        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
			Photo.create({file_name: filename, date_time: Date.now(), user_id: request.session.user_id, comments: []}, function(err, newPhoto) {
				if(err) {
					response.status(400).send(err);
					return;
				}
				newPhoto.id = newPhoto._id;
				newPhoto.save();
				response.end(JSON.stringify(newPhoto));
			});
        });
    });
});

app.delete('/deletePhoto/:photo_id', function(request,response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to delete photo without logging in");
		return;
	}
	var photoId = request.params.photo_id;
	Photo.remove({id: photoId}, function (err) { 
		if(err) {
			response.status(400).send("Could not delete photo");
			return;
		}
		response.end("Photo deleted");
	});
});

app.post('/deleteComment/:photo_id', function(request,response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to delete comment without logging in");
		return;
	}
	var photoId = request.params.photo_id;
	var commentToDelete = request.body.comment;
	Photo.findOne({_id: photoId}, function(err, photo) {
		if(err) {
			response.status(400).send(err.message);
			return;
		}
		for (var c in photo.comments) {
			if(photo.comments[c]._id == commentToDelete._id) {
				photo.comments.splice(c, 1);
			}
		}
		photo.save(function(err) {
			if(err) {
				console.log(err);
				response.status(400).send();
				return;
			}
			response.end(JSON.stringify(photo));
		});
	});
});

app.delete('/deleteUser/:user_id', function(request,response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to delete user without logging in");
		return;
	}
	var userId = request.params.user_id;
	//delete actual user
	User.remove({id: userId}, function (err) { 
		if(err) {
			response.status(400).send("Could not delete user");
			return;
		}
		//delete all of their activities
		Activity.remove({user_id: userId}, function(err, activities) {
			if(err) {
				response.status(400).send("Could not delete user");
				return;
			}
			//delete all of their photos
			Photo.remove({user_id: userId}, function(err, photos){
				if(err) {
					response.status(400).send(err.message);
					return;
				}
				//delete all of their comments and likes
				Photo.find({}, function(err, photos) {
					if(err) {
						response.status(400).send(err.message);
						return;
					}
					async.each(photos, function(photo, callback) {
						for (var c in photo.comments) {
							if(photo.comments[c].user_id == userId) {
								photo.comments.splice(c,1);
								photo.save();
							}
						}
						for (var x in photo.likes) {
							if(photo.likes[x] == userId) {
								photo.likes.splice(x, 1);
								photo.save();
							}
						}
						callback();
					}, function(err) {
						if(err) {
							response.status(400).send(err);
							return;
						}
						response.end("user deleted");
					});
				});
			});
		});
	});
});


app.get('/activities', function(request, response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to view activity feed");
		return;
	}
	Activity.find({}, function(err, activities) {
		if(err) {
			response.status(400).send("Could not retrieve activities");
			return;
		}
		response.end(JSON.stringify(activities));
	});
});

app.post('/add/activity', function(request, response) {
	if(!request.session.login_name && !(request.body.activity_name === "Registered" || request.body.activity_name === "Logged out")) {
		response.status(400).send("Tried to add activity without logging in");
		return;
	}
	var activity = {};
	activity.user_id = request.body.user_id;
	User.findOne({id: activity.user_id}, function(err, user) {
		if(err || !user) {
			response.status(400).send("user does not exist");
			return;
		}
		activity.activity_name = request.body.activity_name;
		if(request.body.comment) {
			activity.comment = request.body.comment;
		} 
		if(request.body.photo_filename) {
			activity.photo_filename = request.body.photo_filename;
		}
		activity.date_time = Date.now();
		Activity.create(activity, function(err, newActivity) {
			if(err) {
				console.log(err);
				response.status(400).send(err);
				return;
			}
			response.end(JSON.stringify(newActivity));
		});
	});
});

app.post('/like/:user_id', function(request, response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to view activity feed");
		return;
	}
	var userId = request.params.user_id;
	var photoId = request.body.photo_id;
	Photo.findOne({id: photoId}, function(err, photo) {
		if(err) {
			response.status(400).send(err);
			return;
		}
		for(var x in photo.likes) {
			if(photo.likes[x] == userId) { //tried to like a photo they already liked
				console.log("Tried to like photo already liked");
				response.status(400).send("Tried to like photo already liked");
				return;
			}
		}
		photo.likes.push(userId);
		photo.save(function(err) {
			if(err) {
				response.status(400).send("couldn't save photo");
				return;
			}
			response.end(JSON.stringify(photo));
		});
	});
});

app.post('/unlike/:user_id', function(request, response) {
	if(!request.session.login_name) {
		response.status(400).send("Tried to view activity feed");
		return;
	}
	var userId = request.params.user_id;
	var photoId = request.body.photo_id;
	Photo.findOne({id: photoId}, function(err, photo) {
		if(err) {
			console.log("Could not find photo");
			response.status(400).send(err);
			return;
		}
		var toDeleteIndex;
		var notLikedYet = true;
		for(var x in photo.likes) {
			if(photo.likes[x] == userId) { 
				notLikedYet = false;
				toDeleteIndex = x;
				break;
			}
		}
		if(notLikedYet) {
			console.log("Tried to like photo not already liked");
			response.status(400).send("Tried to unlike photo not already liked");
			return;
		}
		photo.likes.splice(toDeleteIndex, 1);
		photo.save(function(err) {
			if(err) {
				response.status(400).send("couldn't save photo");
				return;
			}
			response.end(JSON.stringify(photo));
		});
	});
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


