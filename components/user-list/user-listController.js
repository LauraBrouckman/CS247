'use strict';


cs142App.controller('UserListController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
		//$scope.main.title = 'Users Version ' + $scope.main.version;
		$scope.FetchModel('http://localhost:3000/user/list', function(model) {
			$scope.$apply(function() {
				$scope.main.users = model;
			});
		});
		
		$scope.getUsers = function() {
			return $scope.main.users;
		};
		
		$rootScope.$on('loggedIn', function() {
			$scope.FetchModel('http://localhost:3000/user/list', function(model) {
					$scope.$apply(function() {
					$scope.main.users = model;
				});
			});
		});
		
    }]);

