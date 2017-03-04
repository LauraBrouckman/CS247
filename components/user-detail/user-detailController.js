 'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
	var format = function(date) {
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
	
	
	var userId = $routeParams.userId;
	$scope.user = {};
	var url = 'http://localhost:3000/user/' + userId;
	$scope.FetchModel(url, function(model) {
		$scope.$apply(function() {
			$scope.user = model;
		});
	});
	url = 'http://localhost:3000/photosOfUser/' + userId;
	var photos = [];
	$scope.mostRecent = {};
	$scope.mostComments = {};
	$scope.mostRecentDate = "";
	$scope.FetchModel(url, function(model) { 
		photos = model;
		if(photos.length !== 0) {
			var mr = photos[0];
			var mc = photos[0];
			for (var p in photos) {
				if(photos[p].comments.length > mc.comments.length) {
					mc = photos[p];
				}
				if(photos[p].date_time > mr.date_time) {
					mr = photos[p];
				}
			}
			$scope.$apply(function(){
				$scope.mostRecent = mr;
				$scope.mostComments = mc;
				$scope.mostRecentDate = format($scope.mostRecent.date_time); 
			});
		}
	});
	
	$scope.mostRecentExists = function() {
		var x = false;
		if($scope.mostRecent.file_name) {
			x = true;
		}
		return x;
	}

	$scope.mostCommentsExists = function() {
		var x = false;
		if($scope.mostComments.file_name) {
			x = true;
		}
		return x;
	}
  
  }]);
