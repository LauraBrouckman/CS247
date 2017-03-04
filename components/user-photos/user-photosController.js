'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource', '$location', '$route',
  function($scope, $routeParams, $resource, $location, $route) {
    var userId = $routeParams.userId;
	$scope.user = '';
	
	for(var i = 0; i < $scope.main.users.length; i++) {
		if(userId === $scope.main.users[i].id) {
			$scope.user = $scope.main.users[i];
			break;
		}
	}
	
	$scope.onOwnPage = false;
	if($scope.main.currentUser.id === userId) {
			$scope.onOwnPage = true;
	}
	
	$scope.ownComment = function(comment) {
		if(comment.user_id === $scope.main.currentUser.id) {
			return true;
		}
		return false;
	}
	$scope.photos = [];
	
	var url = 'http://localhost:3000/photosOfUser/' + userId;
	$scope.FetchModel(url, function(model) {
		var photoArr = model;
		for(var x in photoArr) {
			photoArr[x].numLikes = photoArr[x].likes.length;
			for(var y in photoArr[x].likes) {
				if(photoArr[x].likes[y] === $scope.main.currentUser.id) {
					photoArr[x].liked = true;
					console.log("Liked", photoArr[x].liked);
				}
			}
			if(!photoArr[x].liked) {
				photoArr[x].liked = false;
			}
				
		}
		photoArr.sort(function(a,b) {
			return b.likes.length - a.likes.length;
		});
		console.log(photoArr);
		$scope.$apply(function() {
			$scope.photos = photoArr;
		});
	});
	
	$scope.getPhotos = function() {
		return $scope.photos;
	};
	
	$scope.getComments = function(photo) {
		return photo.comments;
	};
	
	$scope.deletePhoto = function(photo) {
		var delRes = $resource('/deletePhoto/' + photo._id);
		delRes.delete({}, function () {
			$route.reload();
		}, function errorHandling(err) {
				//$scope.commentError = "Could not add comment";
		});
	};
	
	$scope.deleteComment = function(comment, photo) {
		var commentRes = $resource('/deleteComment/' + photo._id);
		commentRes.save({comment: comment}, function () {
			$route.reload();
		}, function errorHandling(err) {
				$scope.commentError = "Could not delete comment";
		});
	};
	
	$scope.commentError = "";
		
	$scope.addComment = function(comment, photo) {	
		var res = $resource('/commentsOfPhoto/' + photo._id);
		res.save({comment: comment}, function () {
			var commentActivityRes = $resource('/add/activity');
			commentActivityRes.save({user_id: $scope.main.currentUser._id, activity_name: "Commented", comment: comment, photo_filename: photo.file_name}, function() {
				console.log("Added comment activity");
				}, function errorHandling(err) {
					console.log("Could not add comment activity");
				}
			);
			$route.reload();
		}, function errorHandling(err) {
				$scope.commentError = "Could not add comment";
		});
	};
	
	$scope.format = function(date) {
		var dateObj = new Date(date);
		return dayOfWeek(dateObj.getDay()) + month(dateObj.getMonth()) + dateObj.getDate() + ", " + dateObj.getFullYear() + getTime(dateObj);
	};
	function dayOfWeek(i) {
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		return days[i] + ", ";
	}

	function month(i) {
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return months[i] + " ";
	}

	function getTime(date) {
		var timeString = date.toLocaleTimeString();
		var time = timeString.split(":");
		var ampm = timeString.split(" ");
		if (time[0].length == 1)
			time[0] = "0" + time[0];
		return " " + time[0] + ":" + time[1] + " " + ampm[1];
	}
	
	$scope.like = function(photo) {
		console.log($scope.main.currentUser.id);
		var likeRes = $resource('/like/' + $scope.main.currentUser._id);
		likeRes.save({photo_id: photo.id}, function(newPhoto) {
			photo.liked = true;
			photo.numLikes += 1;
		}, function errorHandling(err) {
			console.log("could not like photo");
		});
	};
	
	$scope.unlike = function(photo) {
		var unlikeRes = $resource('/unlike/' + $scope.main.currentUser._id);
		unlikeRes.save({photo_id: photo.id}, function() {
			photo.liked = false;
			photo.numLikes -= 1;
		}, function errorHandling(err) {
			console.log("could not like photo");
		});
	};
	
	
	
  }]);
