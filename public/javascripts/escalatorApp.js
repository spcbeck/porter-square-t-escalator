var app = angular.module('porterSquareTEscalator', ['ui.router', 'angularMoment']);

app.controller("AdminCtrl", [
'$scope',
'entries',
'status',
'auth',
function($scope, entries, status, auth){
	$scope.entriesList = entries.entries;

	$scope.changeStatus = function() {
		status.change();
	};
}]);

app.controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth){
		$scope.user = {};

		$scope.register = function(){
			auth.register($scope.user).error(function(error){
				$scope.error = error;
			}).then(function() {
				$state.go('admin');
			});
		};

		$scope.logIn = function(){
		    auth.logIn($scope.user).error(function(error){
		      	$scope.error = error;
		    }).then(function(){
		      	$state.go('admin');
		    });
		};
	}])

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

app.factory('status', ['$http', 'auth', function($http, auth){
	var s = { status };

	s.change = function() {
		return $http.put('/status', {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data){
	    	s.getStatus();
	    })
	}

	s.getStatus = function() {
		return $http.get('/status').success(function(data){
			s.status = data.status;
		})
	}

	return s;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['porter-token'] = token;
	}

	auth.getToken = function() {
		return $window.localStorage['porter-token'];
	}

	auth.logOut = function(){
	  $window.localStorage.removeItem('porter-token');
	};

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if(token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	}

	auth.currentUser = function() {
		if(auth.isLogged()) {
			var token = auth.getToken();

			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	}

	auth.register = function(user) {
		return $http.post('/register', user).success(function() {
			auth.saveToken(data.token)
		})
	}

	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	return auth;
}])


app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
			
		})
		.state('admin', {
			url: '/admin',
			templateUrl: '/admin.html',
			controller: 'AdminCtrl',
			resolve: {
					postPromise: ['entries', function(entries) {
						entries.getAll().success(function(data) {
							return data;
						});
						
					}]
				},
			onEnter: ['$state', 'auth', function($state, auth){
				if(!auth.isLoggedIn()){
					$state.go('login');
				}
			}]
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('/admin');
				}
			}]
		})
		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('/admin');
				}
			}]
		})

		$urlRouterProvider.otherwise('/');
	}]);