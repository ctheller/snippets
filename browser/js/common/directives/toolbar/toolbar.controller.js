app.controller('ToolbarCtrl', function($scope, $mdSidenav, $rootScope, $state, AuthService, AUTH_EVENTS, Auth, $mdDialog) {

    $scope.user = null;

    var setUser = function() {
        $scope.user = AuthService.getLoggedInUser();
    };

    var removeUser = function() {
        $scope.user = null;
    };

    setUser();

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
    $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

    $scope.sidebarOpen = "false";

    function DialogController($scope, $mdDialog) {
        $scope.closeDialog = function() {
            $mdDialog.hide();
        };
    };


    $scope.viewProfile = function(ev) {
  
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            controller: DialogController,
            templateUrl: 'js/profile/profileCard.html',
            parent: angular.element(document.body)
        });
    };

    $scope.toggle = function() {
        $mdSidenav('left').toggle();
        if ($mdSidenav('left').isOpen()) $rootScope.$emit('open');
        else $rootScope.$emit('close');
    };

    $scope.isLoggedIn = function() {
        return AuthService.isAuthenticated();
    };

    $scope.logout = function() {
        Auth.$signOut();
        $state.go('home');
    };
});
