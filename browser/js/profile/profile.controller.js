app.controller('ProfileCtrl', function($scope, $rootScope, $stateParams, $mdDialog, Auth, Users) {

    // fetches the user's unique id from the $stateParams to look up the user profile

    var uid = $stateParams.userId;

    var user;
    var manager;
    $scope.userCopy = {};

    Users.getById(uid).then(function(user){
        Users.getById(user.manager).then(function(manager){
            user.manager_name = manager.first_name + " " + manager.last_name;
            $scope.userCopy = user;
        })
    })

    // updates the profile upon clicking submit
    $scope.saveProfile = function(userData) {

        var profile = firebase.database().ref("users").child(uid);

        profile.update({
            first_name: userData.first_name,
            last_name: userData.last_name,
            manager: userData.manager
        }).then(function() {
            Materialize.toast('Profile updated', 1250, 'toastAddCollab');
        }).catch(function(err) {
            Materialize.toast('Updates failed', 1250, 'toastDeleted');
        })
    }

    $scope.sendPasswordReset = function() {
        Auth.$sendPasswordResetEmail($scope.userCopy.email)
            .then(function() { Materialize.toast('Password reset email sent', 1250, 'toastAddCollab'); })
            .catch(function(err) { Materialize.toast('Password reset failed', 1250, 'toastDeleted'); });
    }

});
