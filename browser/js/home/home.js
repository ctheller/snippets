app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController',
        resolve: {
            orgJson: function($http, $rootScope) {
                return $http.get('/api/orgtree/' + $rootScope.user.organization).then(function(result) {
                    return result.data;
                });
            }
        }
    });
});
