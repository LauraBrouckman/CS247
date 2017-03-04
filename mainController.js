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
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
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
                redirectTo: '/users'
            });
    }]);

	
cs142App.controller('MainController', ['$scope', '$rootScope', '$location', '$resource', '$http', '$route',
    function ($scope, $rootScope, $location, $resource, $http, $route) {
		$scope.main = {};
		$scope.main.users = [];
		$scope.main.currentUser = {};
		$scope.main.userLoggedIn = false; 
		
		$rootScope.$on( "$routeChangeStart", function(event, next, current) {
			if (!$scope.main.userLoggedIn) {
			// no logged user, redirect to /login-register unless already there
				if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
					$location.path("/login-register");
				}
			}
		});
		
		$scope.logout = function() {
			var res = $resource('/admin/logout');
			res.get({}, function () {
				$scope.main.userLoggedIn = false;
				var photoActivityRes = $resource('/add/activity');
				photoActivityRes.save({user_id: $scope.main.currentUser.id, activity_name: "Logged out"}, function() {
				}, function errorHandling(err) {
					console.log("Could not add logout activity");
					}
				);
				$scope.main.currentUser = {};
				$location.path('/login-register');
			}, function errorHandling(err) {
				$scope.main.title = "Error: could not log user out";
			});
		};
		
		$scope.deleteUser = function() {
			if (confirm("Are you sure you want to delete your profile?") == true) {
				var delRes = $resource('/deleteUser/' + $scope.main.currentUser.id);
				delRes.delete({}, function() {
					$scope.logout();
				}, function errorHandling(err) {
					$scope.main.title = "Error: could not delete profile";
				});
			} 
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
		
		$scope.FetchModel('http://localhost:3000/test/info', function(model) {
			$scope.$apply(function() {
				$scope.main.version = model.version;
				$scope.main.title =  "Version " + $scope.main.version;
			});
		});
		
		//Deal with addition of a photo
		var selectedPhotoFile;   // Holds the last file selected by the user
		$scope.photoError = false;
		
        // Called on file selection - we simply save a reference to the file in selectedPhotoFile
        $scope.inputFileNameChanged = function (element) {
            selectedPhotoFile = element.files[0];
        };

        // Has the user selected a file?
        $scope.inputFileNameSelected = function () {
            return !!selectedPhotoFile;
        };

        // Upload the photo file selected by the user using a post request to the URL /photos/new
		$scope.uploadPhoto = function () {
            if (!$scope.inputFileNameSelected()) {
                console.error("uploadPhoto called will no selected file");
				$scope.photoError = true;
                return;
            }
            console.log('fileSubmitted', selectedPhotoFile);

            // Create a DOM form and add the file to it under the name uploadedphoto
            var domForm = new FormData();
            domForm.append('uploadedphoto', selectedPhotoFile);

            // Using $http to POST the form
            $http.post('/photos/new', domForm, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(newPhoto){
				$scope.photoError = false;
				var photoActivityRes = $resource('/add/activity');
				photoActivityRes.save({user_id: $scope.main.currentUser.id, activity_name: "Photo", photo_filename: newPhoto.file_name}, function() {
					console.log("Added photo activity");
				}, function errorHandling(err) {
					console.log("Could not add photo activity");
					}
				);
                if($route.current.templateUrl === 'components/user-photos/user-photosTemplate.html' || $route.current.templateUrl === 'components/user-detail/user-detailTemplate.html') {
					$route.reload();
				}
            }).error(function(err){
                $scope.photoError = true;
                console.error('ERROR uploading photo', err);
            });

        };
		
		//catch page refresh
		window.onbeforeunload = function () {
			$scope.logout();
		};
	
    }]);
