app.controller('ToolbarCtrl', function ($scope, $mdSidenav, $rootScope) {
    $scope.sidebarOpen="false";
    $scope.toggle = function () {
        $mdSidenav('left').toggle();
        if ($mdSidenav('left').isOpen()) $rootScope.$emit('open');
        else $rootScope.$emit('close');
    };
});
