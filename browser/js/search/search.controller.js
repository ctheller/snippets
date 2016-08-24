app.controller('SearchCtrl', function($scope, $stateParams, $location) {
    $scope.results = ($stateParams.result) ? $stateParams.result.data.hits : null;
    $scope.searchOption = $stateParams.type;
    $scope.goBack = function () {
        // location path is relative
        // hardcoded to parse everything after localhost:1337
        // need to fix this for deployment
        $location.path($stateParams.goBackTo.substr(22));
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
