app.controller('ProfileCtrl', function($scope, $mdDialog, Auth, Users) {

    $scope.hide = function() {
        $mdDialog.hide();
    };

    // clicking save closes the dialog
    $scope.saveProfile = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    // fetches the user's unique id to look up the user profile
    var uid = Auth.$getAuth().uid;

    // updates the profile in the DB using 3-way binding
    Users.getProfile(uid).$bindTo($scope, "user");


})
