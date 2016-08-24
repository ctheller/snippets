app.factory('Graph', function($state, $rootScope, $http) {
    return {
        getWeekSnippets: function(org) {
            return $http.post('/api/graphs', {orgOfUser: org});
        },
        getTeamSnippetCount: function (org) {
            return $http.get('api/org/' + org + '/donut');
        }
    };
});
