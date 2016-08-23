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

    $scope.notifyServiceOnChage = function(){
         console.log($scope.windowHeight);
      };

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



app.directive('resize', function ($window) {
    return function (scope, element, attr) {

        var w = angular.element($window);
        scope.$watch(function () {
            return {
                'h': window.innerHeight,
                'w': window.innerWidth
            };
        }, function (newValue, oldValue) {
            console.log(newValue, oldValue);
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.resizeWithOffset = function (offsetH) {
                scope.$eval(attr.notifier);
                return {
                    'height': (newValue.h - offsetH) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});
