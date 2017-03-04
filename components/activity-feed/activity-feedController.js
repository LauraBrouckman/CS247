'use strict';


cs142App.controller('ActivityFeedController', ['$scope', '$route',
 function ($scope, $route) {
	$scope.activities = [];
	var userName = function(userId) {
		for(var i in $scope.main.users) {
			if(userId === $scope.main.users[i].id) {
				return $scope.main.users[i].first_name + " " + $scope.main.users[i].last_name;
			}
		}
		return "";
	};
	$scope.FetchModel('http://localhost:3000/activities', function(model) {
		$scope.$apply(function() {
			model.sort(function(a, b) {
				a = new Date(a.date_time);
				b = new Date(b.date_time);
				return a>b ? -1 : a<b ? 1 : 0;
			});
			for(var i = 0; i < 20; i++) {
				if(model[i]) {
					var obj = {};
					if(model[i].activity_name === "Logged in" || model[i].activity_name === "Logged out" || model[i].activity_name ===  "Registered") {
						obj.activityString = userName(model[i].user_id) + " " + model[i].activity_name;
					} else if(model[i].activity_name === "Commented") {
						obj.activityString = userName(model[i].user_id) + " commented: " + model[i].comment; 
						obj.photo = model[i].photo_filename;
					} else if(model[i].activity_name === "Photo") {
						obj.activityString = userName(model[i].user_id) + " added a photo at" 
						obj.photo = model[i].photo_filename;
					}
					obj.date = format(model[i].date_time);
					$scope.activities.push(obj);
				}
				else {
					break;
				}
			}
		});
	});
	
	$scope.getActivities = function() {
		return $scope.activities;
	};
	
	$scope.refreshActivities = function() {
		$route.reload();
	};
	
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
		
}]);

