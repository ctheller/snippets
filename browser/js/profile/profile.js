app.config(function($stateProvider) {
    $stateProvider.state('profile', {
    	url: '/profile/:userId',
        controller: 'ProfileCtrl',
        templateUrl: 'js/profile/profile.html'
    });
});
