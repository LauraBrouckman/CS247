'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
			when('/activities', {
				templateUrl: 'components/activity-feed/activity-feedTemplate.html',
				controller: 'ActivityFeedController'
			}).
			when('/login-register', {
				templateUrl: 'components/login-register/login-registerTemplate.html',
				controller: 'LoginRegisterController'
			}).
            when('/users', {
				templateUrl: 'components/activity-feed/activity-feedTemplate.html',
				controller: 'ActivityFeedController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            otherwise({
                redirectTo: '/activities'
            });
    }]);

	
cs142App.controller('MainController', ['$scope', '$rootScope', '$location', '$resource', '$http', '$route',
    function ($scope, $rootScope, $location, $resource, $http, $route) {
		$scope.main = {};
		$scope.main.users = [];
		$scope.main.currentUser = {};
		$scope.main.userLoggedIn = false; 
		$scope.main.invitedPost = {};
		
		$rootScope.$on( "$routeChangeStart", function(event, next, current) {
			if (!$scope.main.userLoggedIn) {
				var res = $resource('/admin/login');
				res.save({login_name: "kenobi", password: "weak"}, function (model) {
					$scope.main.currentUser = model;
					$scope.errorMessage = "";
					$scope.main.userLoggedIn = true;
					$rootScope.$broadcast('loggedIn');
					$location.path('/users');
					}, function errorHandling(err) {
						$scope.errorMessage = "Error: The username or password is incorrect, pleasy try again";
				});
			// no logged user, redirect to /login-register unless already there
				// if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
				// 	$location.path("/login-register");
				// }
			}
		});
		

		$scope.showProfile = function() {
			$location.path('/users/' + $scope.main.currentUser.id);
		};

		$scope.showFeed = function() {
			$location.path('/activities');
		};
		
		
		$scope.FetchModel = function(url, doneCallback) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState !== 4) {
					return;
				}
				if(this.status !== 200) {
					return;
				}
				var model = JSON.parse(this.responseText);
				doneCallback(model);
			};
			xhr.open("GET", url);
			xhr.send();
		};
		
	
    }]);
