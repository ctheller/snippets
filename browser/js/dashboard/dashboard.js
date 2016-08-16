app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        controller: 'DashWrapperCtrl',
        abstract:true,
        templateUrl: 'js/dashboard/dashwrapper.html'
    }).state('dashboard.week', {
    	url: '/:week',
    	templateUrl: 'js/dashboard/dashboard.html',
    	controller: 'DashboardCtrl'
    })
});
