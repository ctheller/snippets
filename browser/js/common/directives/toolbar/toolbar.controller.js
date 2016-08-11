app.controller('ToolbarCtrl', function ($scope, $mdSidenav) {
    $scope.toggle = function () {
        console.log('toggle')
        $mdSidenav('left').toggle();
    }
})
