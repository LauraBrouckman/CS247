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
			print($scope.main.userLoggedIn);
			$scope.main.title = "Hi " + $scope.main.currentUser.first_name;
			$rootScope.$broadcast('loggedIn');
			$location.path('/users');
			}, function errorHandling(err) {
				$scope.errorMessage = "Error: The username or password is incorrect, pleasy try again";
		});
	};
  }]);
