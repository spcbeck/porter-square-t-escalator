var app = angular.module('porterSquareTEscalator', ['ui.router', 'angularMoment']);


app.controller('MainCtrl', [
'$scope',
'entries',
function($scope, entries){
	$scope.statusDisplayName = "yes";
	$scope.updatedStatus = "";
	$scope.statusSet = "";
	$scope.status = true;

	if($scope.status == false) {
		$scope.statusDisplayName = "no";
		$scope.statusCheck = false;
	}

	if($scope.status == true) {
		$scope.statusDisplayName = "yes";
		$scope.statusCheck = true;
	}

	$scope.setBroken = function() {
		$scope.updatedStatus = false;
		$scope.statusSet = true;
	}

	$scope.setWorking = function() {
		$scope.updatedStatus = true;
		$scope.statusSet = true;
	}

	$scope.addEntry = function() {
		var date = new Date();

		entries.create({
			status: $scope.updatedStatus,
			comment: $scope.comment,
			date: date,
		});

		$scope.comment = '';
	};
}]);

app.controller('EntriesCtrl', [
'$scope',
'entries',
function($scope, entries){
	$scope.entriesList = entries.entries;
	console.log($scope.entriesList);

}])


app.factory('entries', ['$http', function($http){
	var o = { entries: [] };

	o.create = function(entry) {
		return $http.post('/entries', entry).success(function(data){
			o.entries.push(data);
		})
	}

	o.getAll = function() {
		return $http.get('/entries').success(function(data){
			angular.copy(data, o.entries);
		})
	}

	return o;
}])


app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		})
		.state('admin', {
			url: '/admin',
			templateUrl: '/admin.html',
			controller: 'AdminCtrl'
		})
		.state('entries', {
			url: '/entries',
			templateUrl: '/entries.html',
			controller: 'EntriesCtrl',
			resolve: {
					postPromise: ['entries', function(entries) {
						return entries.getAll();
					}]
				}
		})

		$urlRouterProvider.otherwise('home');

	}]);