'use strict';


cs142App.controller('ActivityFeedController', ['$scope', '$route', '$location', '$mdDialog', '$window', '$resource' ,'$rootScope',
 function ($scope, $route, $location, $mdDialog, $window, $resource, $rootScope) {
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
					obj.article_slant = model[i].article_slant;
					obj.url = model[i].url;
					obj.absolute_value_bias_level = Math.abs(obj.bias_level);
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



	$scope.openArticle = function(post) {
		var res = $resource('/setBiasOfUser/' + $scope.main.currentUser._id);
		//NOTE HERE THERE SHOULD MAYBE BE BETTER SOME WAY TO CALCULATE THE EFFECT THE ARTICLE READING HAS ON USER'S BIAS
		var newBiasLevel = $scope.main.currentUser.bias_level + post.article_slant;
		res.save({bias_level: newBiasLevel}, function () {
			$rootScope.$broadcast('currentUserChanged');
		}, function errorHandling(err) {
				console.log("Could not change the bias level");
		});
		$window.open(post.url);
	};

	$scope.inviteToRead = function(ev, post) {
		invitedPost = post;
		invitedPost.currentUserName = $scope.main.currentUser.first_name;
	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'dialog1.tmpl.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    });
  	};

  	var messageToSend = "";

  	var nameOnChatTab = "";

  	$scope.nameOnChatTab = "";

  	$scope.showMessageTab = false;

  	var sendMessage = function(ev, message, poster) {
  		messageToSend = message;
  		nameOnChatTab = poster;
  		newChatMessages = [];
  		$scope.nameOnChatTab = poster;
  		$scope.showMessageTab = false;
  		$mdDialog.show({
	      controller: ChatDialogController,
	      templateUrl: 'chat.tmpl.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false,
	      fullscreen: false,
	      multiple: true,
	      openFrom: {
	          top: 2000,
	          width: 125,
	          height: 50,
	          left: 2000 
	      },
        closeTo: {
          	  top: 2000,
	          width: 125,
	          height: 50,
	          left: 2000 
        } // Only for -xs, -sm breakpoints.
	    });
  	};

  	var showMessageTab = function() {
	      $scope.showMessageTab = true;
  	}

  	var newChatMessages = [];

  	$scope.showChat = function(ev) {
  		$scope.showMessageTab = false;
  		$mdDialog.show({
	      controller: ChatDialogController,
	      templateUrl: 'chat.tmpl.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    });
  	}


  	function ChatDialogController($scope, $mdDialog, $timeout) {
  		$scope.sentMessage = messageToSend;
  		$scope.messagesSent = [];
  		$scope.showReceivedMessage = false;
  		$scope.nameOnTab = nameOnChatTab;
  		$timeout(function(){ $scope.showReceivedMessage = true;}, 3000);
  		for (var i = 0; i < newChatMessages.length; i++) {
  			$scope.messagesSent.push(newChatMessages[i]);
  		}
  		$scope.newChatMessage = "";
	  	$scope.hide = function() {
	      $mdDialog.hide();
	    	showMessageTab()
	    };

	    $scope.cancel = function() {
	    	showMessageTab()
	      $mdDialog.cancel();
	    };

	    $scope.getSentMessages = function() {
	    	return $scope.messagesSent;
	    }

	    $scope.sendNewMessage = function() {
	    	if($scope.newChatMessage != "") {
	    		var m = {
	    			text: $scope.newChatMessage,
	    			id: Math.random()
	    		}
	    		newChatMessages.push({text: $scope.newChatMessage, id: Math.random()});
	    		$scope.messagesSent.push(m);
	    		console.log(newChatMessages);
	    		console.log($scope.messagesSent);
	    		$scope.newChatMessage = "";
	    	}
	    }
  	}



  function DialogController($scope, $mdDialog) {
  	$scope.invitedPost = invitedPost;
  	$scope.message = "";
  	$scope.articleUrl = "";
  	$scope.message = {
		type: "neutral",
		from: "Anonymous"
	}

	var messageDictionary = {
		neutral: "I saw that you posted the article '" + invitedPost.article_title + "' which seems in line with your news reading bias.",
		aggressive: "I saw your post about the article '" + invitedPost.article_title + "' and I don't agree with you. Please read this to get a new perspective on the issue.",
		nice: "After reading the article you posted, '" + invitedPost.article_title + "' I realize that we have a difference of opinion. I don't expect you to change your mind, but I think it is important to read different opinions."
	}

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.sendInvitation = function(ev) {
    	if($scope.articleUrl == "") {
    		console.log("error there is no url posted");
    	}
    		var messageToSend = "Hi " + $scope.invitedPost.poster.split(" ")[0] + ",\n";
    		messageToSend += messageDictionary[$scope.message.type];
    		messageToSend += "I would like to invite you to read " + $scope.articleUrl;
    		sendMessage(ev, messageToSend, $scope.invitedPost.poster);
    	  $mdDialog.hide();
    };
  }
		
}]);


