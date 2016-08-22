app.config(function($stateProvider) {
    $stateProvider.state('profile', {
    	url: '/profile',
        controller: 'ProfileCtrl',
        templateUrl: 'js/profile/profile.html'
    });
});
