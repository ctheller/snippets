app.controller('SearchCtrl', function($scope, $stateParams, $location) {
    $scope.results = ($stateParams.result) ? $stateParams.result.data.hits : null;
    $scope.searchOption = $stateParams.type;
    console.log($stateParams.goBackTo);
    $scope.goBack = function () {
        $location.path($stateParams.goBackTo);
    }
    if ($stateParams.type === 'snippet') {
        $scope.snippets = (!$scope.results) ? null : $scope.results.map(function(res) {
            return {
                'id': res._id,
                'type': 'all'
            }
        });
    } else {
        $scope.users = $scope.results.map(obj => obj._source);
    }
});
