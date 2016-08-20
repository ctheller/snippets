app.controller('SidebarCtrl', function($scope, $rootScope, AuthService, Auth, AUTH_EVENTS, $mdMedia, MdHelpers, $state, $mdSidenav) {

    $scope.items = [
        { label: 'Home', state: 'home', icon: 'home' },
        { label: 'Profile', state: 'profile', icon: 'person' },
        { label: 'Dashboard', state: 'dashboard.week({week:0})', icon: 'inbox' },
        { label: 'Analytics', state: 'graphing', icon: 'show_chart' }
    ];

    $scope.user = null;

    $scope.isLoggedIn = function() {
        return AuthService.isAuthenticated();
    };

    $scope.logout = function() {
        Auth.$signOut();
    };

    $scope.go = function(state){
        $state.go(state);
    }

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

    $scope.sidebarOpen = false;

    $rootScope.$on('toggle', function () {
        $scope.sidebarOpen = !$scope.sidebarOpen;
    });

});
