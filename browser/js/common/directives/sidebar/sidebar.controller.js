app.controller('SidebarCtrl', function($scope, $rootScope, AuthService, AUTH_EVENTS, $state, $mdSidenav, $log) {

    $scope.items = [
        { label: 'Home', state: 'home', icon: 'home' },
        { label: 'Profile', state: 'about', icon:'person' },
        { label: 'Dashboard', state: 'dashboard', icon:'inbox' },
        { label: 'Members', state: 'membersOnly', icon:'casino' }
    ];

    $scope.user = null;

    $scope.isLoggedIn = function() {
        return AuthService.isAuthenticated();
    };

    $scope.logout = function() {
        AuthService.logout().then(function() {
            $state.go('home');
        });
    };

    var setUser = function() {
        AuthService.getLoggedInUser().then(function(user) {
            $scope.user = user;
        });
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
        console.log('gotcha')
        $scope.sidebarOpen = !$scope.sidebarOpen;
    })

})

