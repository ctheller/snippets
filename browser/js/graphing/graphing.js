app.config(function ($stateProvider) {
    $stateProvider.state('graphing', {
        url: '/graph',
        controller: 'GraphCtrl',
        templateUrl: 'js/graphing/graphing.html',
        resolve: {
            getSnips: function(Graph, $rootScope) {
                return Graph.getWeekSnippets($rootScope.user.organization);
            }
        }
    });
});

app.controller('GraphCtrl', function($scope, $rootScope, Graph, getSnips){

    console.log(getSnips);
    $scope.$on('$viewContentLoaded', function(){
        WordCloud(document.getElementById('wordCloud'), { list: $scope.tags } );
    //     // $scope.getWeekSnippets($rootScope.user.organization)
    //     // .then(function(result) {
    //     //    console.log(result);
    //     // });
    //     // WordCloud(document.getElementById('wordCloud'), { list: $scope.tags } );
    });

    $scope.tags = [['foo', 12], ['bar', 6], ['Gabe', 80]];

});
