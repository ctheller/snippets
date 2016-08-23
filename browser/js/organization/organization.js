app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/organization',
        templateUrl: 'js/organization/organization.html',
        controller: 'OrgController',
        resolve: {
            orgJson: function($http, $rootScope) {
                return $http.get('/api/orgtree/' + $rootScope.user.organization).then(function(result) {
                    return result.data;
                });
            }
        }
    });
});
