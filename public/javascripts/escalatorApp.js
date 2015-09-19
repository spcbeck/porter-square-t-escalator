var app = angular.module('porterSquareTEscalator', ['ui.router', 'angularMoment']);


app.controller('MainCtrl', [
'$scope',
'entries',
'status',
function($scope, entries, status){
	$scope.statusDisplayName = "";
	$scope.updatedStatus = "";
	$scope.statusSet = "";
	$scope.statusContainer = "";
	$scope.showSuccess = false;

	status.getStatus().success(function(data) { 
	    $scope.statusContainer = data.status;

	    if($scope.statusContainer == false) {
			$scope.statusDisplayName = "no";
			$scope.statusCheck = false;
		} else if($scope.statusContainer == true) {
			$scope.statusDisplayName = "yes";
			$scope.statusCheck = true;
		}
	});
	
	$scope.setBroken = function() {
		$scope.updatedStatus = false;
		$scope.statusSet = true;
	}

	$scope.setWorking = function() {
		$scope.updatedStatus = true;
		$scope.statusSet = true;
	}

	$scope.changeStatus = function() {
		status.change();
	}

	$scope.addEntry = function() {
		var date = new Date();

		entries.create({
			status: $scope.updatedStatus,
			comment: $scope.comment,
			date: date,
		});

		$scope.showSuccess = true;

		$scope.statusSet = false;
		$scope.comment = '';
	};

	$scope.addInitialStatus = function() {
		status.create({
			status: true
		});
	}

}]);

app.controller('EntriesCtrl', [
'$scope',
'entries',
function($scope, entries){
	$scope.entriesList = entries.entries;

}])


app.factory('entries', ['$http', function($http){
	var o = { entries: [] };

	o.create = function(entry) {
		return $http.post('/entries', entry).success(function(data){
			o.entries.push(data);
		})
	}

	o.getAll = function() {
		return $http.getJSON('/entries').success(function(data){
			angular.copy(data, o.entries);
		})
	}

	return o;
}])

app.factory('status', ['$http', function($http){
	var s = { status };

	s.change = function() {
		return $http.put('/status').success(function(data){
	    	s.getStatus();
	    	console.log('success put');
	    })
	}

	s.getStatus = function() {
		return $http.get('/status').success(function(data){
			s.status = data.status;
		})
	}

	return s;
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