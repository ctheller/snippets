app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardCtrl',
        templateUrl: 'js/dashboard/dashboard.html'
    });
})
