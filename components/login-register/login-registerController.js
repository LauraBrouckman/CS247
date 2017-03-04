'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$routeParams', '$resource', '$rootScope', '$location',
  function ($scope, $routeParams, $resource, $rootScope, $location) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
	$scope.main.title = "Please Login";
	$scope.errorMessage = "";
	$scope.login = function() {
		var res = $resource('/admin/login');
		res.save({login_name: $scope.loginForm.loginName.$viewValue, password: $scope.loginForm.password.$viewValue}, function (model) {
			$scope.main.currentUser = model;
			$scope.errorMessage = "";
			$scope.main.userLoggedIn = true;
			$scope.main.title = "Hi " + $scope.main.currentUser.first_name;
			$rootScope.$broadcast('loggedIn');
			var loginActivityRes = $resource('/add/activity');
			loginActivityRes.save({user_id: $scope.main.currentUser.id, activity_name: "Logged in"}, function() {
				console.log("logging in activity added");
			}, function errorHandling(err) {
				console.log("Could not add logging in activity");
				}
			);
			$location.path('/users');
			}, function errorHandling(err) {
				$scope.errorMessage = "Error: The username or password is incorrect, pleasy try again";
		});
	};
	var clearFields = function() {
		console.log("clear");
		$scope.firstName = "";
		$scope.lastName = "";
		$scope.occupation = "";
		$scope.location = "";
		$scope.description = "";
		$scope.registerLoginName = "";
		$scope.registerPassword = ""; 
		$scope.confirmPassword = "";
		$scope.registerForm.$setPristine();
	};
	
	$scope.registerError = false;
	$scope.registerSuccess = false;
	$scope.registerErrorMessage = "";
	$scope.register = function(firstName, lastName, occupation, location, description, registerLoginName, registerPassword, confirmPassword) {
		if(registerPassword != confirmPassword) {
			$scope.registerErrorMessage = "Passwords do not match, please retry";
			$scope.registerError = true;
			clearFields();
			return;
		}
		var registerRes = $resource('/user');
		registerRes.save({first_name: firstName, last_name: lastName, occupation: occupation, location: location, description: description, login_name: registerLoginName, password: registerPassword},
			function(model) {
				clearFields();
				$scope.registerError = false;
				$scope.registerSuccess = true;
				clearFields();
				var registerActivityRes = $resource('/add/activity');
				registerActivityRes.save({user_id: model.id, activity_name: "Registered"}, function() {
					}, function errorHandling(err) {
					console.log("Could not add registering activity");
					}
				);
			}, function errorHandling(err) {
				clearFields();
				$scope.registerErrorMessage = "The username has been taken, please change it and try again";
				$scope.registerError = true;
			}
		);	
	};	
  }]);
