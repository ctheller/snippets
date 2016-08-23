app.config(function($stateProvider) {
    $stateProvider.state('graphing', {
        url: '/graph',
        controller: 'GraphCtrl',
        templateUrl: 'js/graphing/graphing.html',
        resolve: {
            orgJson: function($http, $rootScope) {
                return $http.get('/api/orgtree/' + $rootScope.user.organization).then(function(result) {
                    return result.data;
                });
            }
        }
    });
});

app.controller('GraphCtrl', function($scope, $rootScope, orgJson) {

    // $http.get('/api/orgtree/' + $rootScope.user.organization).then(function(result) {
        $scope.orgJson = orgJson;
    // });


    //{topId: {nextLevelId1:{}, nextLevelId2:{ }}}

    // var tree = {};
    // $rootScope.users.forEach(function(user){
    //  if (!user.manager)
    //  if (tree.hasOwnProperty(user.manager)) tree[user.manager].push(user.$id)
    // })

});
