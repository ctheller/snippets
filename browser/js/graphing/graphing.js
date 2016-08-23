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
    // console.log(getSnips.data);
    $scope.cardStyle;

    $scope.$on('$viewContentLoaded', function(){
        let widthStr = window.getComputedStyle(document.getElementsByClassName("widthToMeasure")[0], null).width;
        let widthToPass = (Number(widthStr.slice(0,-2))) + 'px';
        let heightToPass = window.getComputedStyle(document.getElementsByClassName("widthToMeasure")[0], null).height;
        $scope.canvasStyle = {width: widthToPass, height: heightToPass};
        setTimeout(function() {
            WordCloud(document.getElementById('wordCloud'), { list: getSnips.data, backgroundColor: 'transparent' } );
            let newHeight = (Number(heightToPass.slice(0,-2)) + 5) + 'px';
            console.log(newHeight);
            $scope.cardStyle = {'height': newHeight};
            $scope.$digest();
        }, 100);

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

