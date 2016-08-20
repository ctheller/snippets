app.controller('SearchCtrl', function($scope, $stateParams) {
    $scope.results = $stateParams.result.data.hits;
    console.log($scope.results);
    $scope.snippets = (!$scope.results) ? null : $scope.results.map(function(res) {
        return {
            'id': res._id,
            'type': 'all'
        }
    });
});
