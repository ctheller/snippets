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
                Snippet.create($scope.newSnippet).then(function(){
                    Materialize.toast('Snippet created', 1250, 'toastCreated');
                }).catch(function(){
                    Materialize.toast('Error creating snippet', 2000, 'toastFail');
                });
                $mdDialog.cancel();
            };
        }
    };
});
