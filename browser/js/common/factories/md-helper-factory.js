app.factory('MdHelpers', function() {
    return {
        dialogCtrl: function($scope, $mdDialog, Snippet) {
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
                Snippet.create($scope.newSnippet);
                $mdDialog.cancel();
            };
        }
    };
});
