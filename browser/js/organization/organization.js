app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/organization',
        templateUrl: 'js/organization/organization.html',
        controller: 'OrgController',
        resolve: {
            orgJson: function($http, $rootScope) {
                return $http.get('/api/org/' + $rootScope.user.organization + '/tree').then(function(result) {
                    return result.data;
                });
            }
        }
    });
});
