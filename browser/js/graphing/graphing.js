app.config(function ($stateProvider) {
    $stateProvider.state('graphing', {
        url: '/graph',
        controller: 'GraphCtrl',
        templateUrl: 'js/graphing/graphing.html'
    })
});

app.controller('GraphCtrl', function($scope, $rootScope){

    console.log($rootScope.users);


    //{topId: {nextLevelId1:{}, nextLevelId2:{ }}}

    // var tree = {};
    // $rootScope.users.forEach(function(user){
    // 	if (!user.manager)
    // 	if (tree.hasOwnProperty(user.manager)) tree[user.manager].push(user.$id)
    // })

});