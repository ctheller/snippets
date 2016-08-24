app.controller('SidebarCtrl', function($scope, $rootScope, AuthService, Auth, AUTH_EVENTS, $mdMedia, MdHelpers, $state, $mdSidenav) {

    $scope.items = [
        { label: 'Organization', state: 'home', icon: 'home' },
        { label: 'Profile', state: 'profile', icon: 'person' },
        { label: 'Dashboard', state: 'dashboard.week({week:0})', icon: 'inbox' },
        { label: 'Analytics', state: 'graphing', icon: 'show_chart' }
    ];

    $scope.user = null;

    $scope.logout = AuthService.logout;

    $scope.go = function(state){
        $state.go(state);
    }

    var closeSidebar = function() {
        $scope.sidebarOpen = false;
    };

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, closeSidebar);

    $scope.sidebarOpen = false;

    $rootScope.$on('toggle', function () {
        $scope.sidebarOpen = !$scope.sidebarOpen;
    });

});
