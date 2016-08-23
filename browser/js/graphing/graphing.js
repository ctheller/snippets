app.config(function($stateProvider) {
    $stateProvider.state('graphing', {
        url: '/graph',
        controller: 'GraphCtrl',
        templateUrl: 'js/graphing/graphing.html',
        resolve: {
            getSnips: function(Graph, $rootScope) {
                return Graph.getWeekSnippets($rootScope.user.organization);
            },
            orgJson: function($http, $rootScope) {
                return $http.get('/api/orgtree/' + $rootScope.user.organization).then(function(result) {
                    return result.data;
                });
            }
        }
    });
});

app.controller('GraphCtrl', function($scope, $rootScope, orgJson, getSnips) {

    // $http.get('/api/orgtree/' + $rootScope.user.organization).then(function(result) {
        $scope.orgJson = orgJson;
    // });
    $scope.canvasStyle = {width: '300px', height: '300px'};
    // console.log(getSnips.data);
    $scope.$on('$viewContentLoaded', function(){
        setTimeout(function() {
            WordCloud(document.getElementById('wordCloud'), { list: getSnips.data } );
        }, 5000);
    //     // $scope.getWeekSnippets($rootScope.user.organization)
    //     // .then(function(result) {
    //     //    console.log(result);
    //     // });
    //     // WordCloud(document.getElementById('wordCloud'), { list: $scope.tags } );
    });

    // $scope.tags = [['foo', 12], ['bar', 6], ['Gabe', 80]];
    // var tree = {};
    // $rootScope.users.forEach(function(user){
    //  if (!user.manager)
    //  if (tree.hasOwnProperty(user.manager)) tree[user.manager].push(user.$id)
    // })
});
