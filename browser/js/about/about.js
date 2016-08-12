app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope, Profile, AuthService, AUTH_EVENTS, $rootScope, Snippet) {

    var setSnippetBinding = function() {
    	// var snippetIds = Object.keys($scope.user.snippets);
    	// snippetIds.forEach(function(snippetId, i){
    	// 	$scope.snippets[i] = {};
    	// 	Snippet(snippetId).$bindTo($scope.snippets[i], 'snippet');
    	// })
    	Snippet(Object.keys($scope.user.snippets)[0]).$bindTo($scope, 'snippet');
    }

    var setUserBinding = function() {    
        $scope.user = AuthService.getLoggedInUser();
        if ($scope.user) Profile($scope.user.$id).$bindTo($scope, "user").then(function(){
        	setSnippetBinding();
        })
    };

    var removeUser = function() {
        $scope.user = null;
    };

    setUserBinding();

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUserBinding);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);

});