app.controller('HomeController', function ($scope,Users, AuthService, AUTH_EVENTS, $rootScope, $log) {




    var setUserBinding = function() {
        $scope.user = AuthService.getLoggedInUser();
        if ($scope.user) Users.getProfile($scope.user.$id).$bindTo($scope, "user").then(function(){
            $scope.snippetIds = Object.keys($scope.user.snippets);
        }).catch($log);
    };



    setUserBinding();
    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUserBinding);
});
