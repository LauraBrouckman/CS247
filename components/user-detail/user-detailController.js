 'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
	
	var userId = $routeParams.userId;
	$scope.user = {};
	var url = 'http://localhost:3000/user/' + userId;
	$scope.FetchModel(url, function(model) {
		$scope.$apply(function() {
			$scope.user = model;
		});
	});
	url = 'http://localhost:3000/photosOfUser/' + userId;
  
  }]);
