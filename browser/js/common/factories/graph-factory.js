app.factory('Graph', function($state, $rootScope, $http) {
    return {
        getWeekSnippets: function(org) {
            return $http.post('/api/graphs', {orgOfUser: org});
        }
    };
});
