app.controller('SearchCtrl', function($scope, $stateParams) {
    $scope.results = $stateParams.result.data.hits;
    $scope.searchOption = $stateParams.type;
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
