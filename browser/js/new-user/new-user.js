app.config(function ($stateProvider) {
    $stateProvider.state('new-user', {
        url: '/new-user',
        controller: 'NewUserCtrl',
        templateUrl: 'js/new-user/new-user.html'
    });
})
