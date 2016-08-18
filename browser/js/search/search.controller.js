app.controller('SearchCtrl', function ($scope, $stateParams) {
    console.log($stateParams)
    $scope.results = $stateParams.result.data.hits;
    $scope.snippets = $scope.results.map(function (res) {
        return {
            'id': res._id,
            'type': 'all'
        }
    });
})
