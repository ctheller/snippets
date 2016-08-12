app.factory('MdHelpers', function() {
    return {
        dialogCtrl: function($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
            $scope.submitSnippet = function() {
                console.log('submitted?', $scope.newSnippet)
            }
        }
    }
})
