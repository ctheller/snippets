app.controller('SearchCtrl', function ($scope, $stateParams) {
    console.log($stateParams.result.data)
    $scope.results = $stateParams.result.data.hits;
    $scope.snippets = (!$scope.results) ? null : $scope.results.map(function (res) {
        return {
            'id': res._id,
            'type': 'all'
        }
    });
});
