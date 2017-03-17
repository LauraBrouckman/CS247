 'use strict';

 cs142App.controller('UserDetailController', ['$scope', '$routeParams', '$mdDialog', '$window', '$resource' ,'$rootScope',
 	function ($scope, $routeParams, $mdDialog, $window, $resource ,$rootScope) {
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
     		$scope.user.absolute_value_bias_level = Math.abs(model.bias_level);
     		$scope.onOwnPage = ($scope.main.currentUser._id === $scope.user._id);
     	});
     });
     url = 'http://localhost:3000/photosOfUser/' + userId;


     $scope.$on('currentUserChanged', function() {
          if($scope.onOwnPage) {
               var url = 'http://localhost:3000/user/' + $scope.main.currentUser._id;
               $scope.FetchModel(url, function(model) {
                    $scope.$apply(function() {
                         $scope.user = model;
                         $scope.user.absolute_value_bias_level = Math.abs(model.bias_level);
                    });
               });
          }
     });

     $scope.askForReframe = function(ev) {
     	$mdDialog.show({
     		controller: ReframeDialogController,
     		templateUrl: 'fb.reframe.tmpl.html',
     		parent: angular.element(document.body),
     		targetEvent: ev,
     		clickOutsideToClose:true,
     		fullscreen: false,
		      scope: $scope,        // use parent scope in template
         	  preserveScope: true // Only for -xs, -sm breakpoints.
         	});
     }

     function ReframeDialogController($scope, $mdDialog) {
     	$scope.liberalArticles = [];
     	$scope.conservativeArticles = [];
     	$scope.neutralArticles = [];
     	$scope.suggestedArticle = {};

     	$scope.FetchModel('http://localhost:3000/activities', function(model) {
     		$scope.$apply(function() {
     			for(var i = 0; i < 20; i++) {
     				if(model[i]) {
     					var obj = {};
     					obj.article_title = model[i].article_title;
     					obj.article_subtitle = model[i].article_subtitle;
     					obj.article_source = model[i].article_source;
     					obj.article_picture = model[i].article_pic_file;
     					obj.article_slant = model[i].article_slant;
     					obj.url = model[i].url;
     					if (obj.article_slant > 0) {
     						$scope.liberalArticles.push(obj);
     					} else if (obj.article_slant < 0) {
     						$scope.conservativeArticles.push(obj);
     					} else {
     						$scope.neutralArticles.push(obj);
     					}
     					//If they are super biased either way, give them a neutral article
     					if(Math.abs($scope.user.bias_level) >= 5 ) {
							$scope.suggestedArticle = $scope.neutralArticles[0];
						}

						//If they are only a little biased one way, give them an opposite article
						else {
							if($scope.user.bias_level > 0) { //liberal
								$scope.suggestedArticle = $scope.conservativeArticles[0];
							} else {
								$scope.suggestedArticle = $scope.liberalArticles[0];
							}
						}
     				}
     				else {
     					break;
     				}
     			}
     		});
		});


		$scope.openArticle = function() {
               var article = $scope.suggestedArticle;
			var res = $resource('/setBiasOfUser/' + $scope.main.currentUser._id);
			//NOTE HERE THERE SHOULD MAYBE BE BETTER SOME WAY TO CALCULATE THE EFFECT THE ARTICLE READING HAS ON USER'S BIAS

			var oldBiasLevel = $scope.main.currentUser.bias_level;
				// Neutral article 
			var newBiasLevel = 0;
			if(article.article_slant == 0) { //reading a neutral articles helps by 2
				newBiasLevel = Math.max(Math.abs(oldBiasLevel) - 2, 0) * Math.sign(oldBiasLevel); 
			} else {
				newBiasLevel = oldBiasLevel + article.article_slant;
			}
			res.save({bias_level: newBiasLevel}, function () {
				$rootScope.$broadcast('currentUserChanged');
			}, function errorHandling(err) {
					console.log("Could not change the bias level");
			});

               $mdDialog.hide();
			$window.open(article.url);
		};



		 $scope.hide = function() {
		 	$mdDialog.hide();
		 };

		 $scope.cancel = function() {
		 	$mdDialog.cancel();
		 };
	};

}]);
