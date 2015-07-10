var app = angular.module('porterSquareTEscalator', ['ui.router']);

app.controller('MainCtrl', [
'$scope',
function($scope){
  $scope.test = 'Hello world!';
}]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('home', {
			url: '/',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		});

		$urlRouterProvider.otherwise('home');

	}]);