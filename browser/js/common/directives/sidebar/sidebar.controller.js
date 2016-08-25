app.controller('SidebarCtrl', function($scope, $rootScope, AuthService, Auth, AUTH_EVENTS, $mdMedia, MdHelpers, $state, $mdSidenav) {

    $scope.items = [
        { label: 'Dashboard', state: 'dashboard.week({week:0})', icon: 'inbox' },
        { label: 'Organization', state: 'home', icon: 'home' },
        { label: 'Analytics', state: 'graphing', icon: 'show_chart' },
        { label: 'Profile', state: "profile({'userId':'" + $scope.user.$id + "'})", icon: 'person' }
    ];

    $scope.containDashboard = function(key) {
        if (key.indexOf('dashboard') > -1) return true;
        else return false;
    }

    $scope.logout = AuthService.logout;

    $scope.go = function(state) {
        $state.go(state);
    }

    var closeSidebar = function() {
        $scope.sidebarOpen = false;
    };

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, closeSidebar);

    $scope.sidebarOpen = false;

    $rootScope.$on('toggle', function() {
        $scope.sidebarOpen = !$scope.sidebarOpen;
    });

});
