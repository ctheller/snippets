app.controller('DashboardCtrl', function($scope, $mdDialog, MdHelpers) {
    $scope.newSnippet = {};
    $scope.showSnippetForm = function(ev) {
        $mdDialog.show({
            controller: MdHelpers.dialogCtrl,
            templateUrl: 'js/dashboard/new-snippet-form.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
    };
    $scope.draggables = [
        {icon: 'people'}, {icon: 'person'}
    ];
    $scope.dragged = [];
    console.log($scope.dragged)


})
