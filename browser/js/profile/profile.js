app.config(function($stateProvider) {
    $stateProvider.state('profile', {
        onEnter: ['$mdDialog', function($mdDialog) {
            $mdDialog.show({
                templateUrl: 'js/profile/profile.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
            });
        }]
    });
});
