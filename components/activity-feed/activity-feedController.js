'use strict';


cs142App.controller('ActivityFeedController', ['$scope', '$route', '$location', '$mdDialog', 
 function ($scope, $route, $location, $mdDialog) {
	$scope.posts = [];
	var userName = function(userId) {
		for(var i in $scope.main.users) {
			if(userId === $scope.main.users[i].id) {
				return $scope.main.users[i].first_name + " " + $scope.main.users[i].last_name;
			}
		}
		return "";
	};

	$scope.FetchModel('http://localhost:3000/user/list', function(model) {
		$scope.$apply(function() {
			$scope.main.users = model;
		});
	});

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
					obj.profile_picture = model[i].profile_pic_file;
					obj.poster = userName(model[i].user_id);
					obj.user_id = model[i].user_id;
					var oldDate = new Date(model[i].date_time);
					var newDate = new Date();
					obj.date = format(newDate, oldDate) 
					obj.article_title = model[i].article_title;
					obj.article_subtitle = model[i].article_subtitle;
					obj.article_source = model[i].article_source;
					obj.article_picture = model[i].article_pic_file;
					obj.bias_level = model[i].bias_level;
					$scope.posts.push(obj);
				}
				else {
					break;
				}
			}
		});
	});

	$scope.showUserProfile = function(user_id) {
		$location.path('/users/' + user_id);
	}
	
	$scope.getPosts = function() {
		return $scope.posts;
	};
	
	$scope.refreshPosts = function() {
		$route.reload();
	};
	
	var format = function(newDate, oldDate) {
		var minutesAgo = (newDate - oldDate)/60000
		if (minutesAgo >= 60) {
			var hoursAgo = minutesAgo / 60;
		} else {
			return parseInt(minutesAgo) + " minutes ago";
		}
		if (hoursAgo >= 24) {
			var daysAgo = hoursAgo / 24;
		}  else {
			return parseInt(hoursAgo) + " hours ago";
		} 
		if (daysAgo >= 7) {
			var weeksAgo = daysAgo / 7;
		} else {
			return parseInt(daysAgo) + " days ago";
		}
		return parseInt(weeksAgo) + " weeks ago";
		
	};

	var invitedPost = {}

	$scope.inviteToRead = function(ev, post) {
		invitedPost = post;
	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'dialog1.tmpl.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    });
  	};

  function DialogController($scope, $mdDialog) {
  	$scope.invitedPost = invitedPost;
  	console.log($scope.invitedPost);
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.sendInvitation = function() {
    	//CODE TO SEND INVITATION TO CHALLENGE GOES HERE!!!
      $mdDialog.hide();
    };
  }
		
}]);


