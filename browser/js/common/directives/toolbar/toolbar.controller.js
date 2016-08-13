app.controller('ToolbarCtrl', function($scope, $mdSidenav, $rootScope, AuthService, AUTH_EVENTS) {
    $scope.user = null;
    var setUser = function() {
        $scope.user = AuthService.getLoggedInUser();
    };
    setUser();
    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $scope.sidebarOpen = "false";
    $scope.toggle = function() {
        $mdSidenav('left').toggle();
        if ($mdSidenav('left').isOpen()) $rootScope.$emit('open');
        else $rootScope.$emit('close');
    };
});
