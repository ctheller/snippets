app.controller('AdminProfileCtrl', function($scope, $rootScope, $mdDialog, $state, $stateParams, Users) {

    var user;
    var manager;
    $scope.userCopy = {};

    Users.getById($stateParams.userId).then(function(user){
        Users.getById(user.manager).then(function(manager){
            user.manager_name = manager.first_name + " " + manager.last_name;
            $scope.userCopy = user;
        })
    })

    // updates the profile upon clicking submit
    $scope.saveProfile = function(userData) {
        var profile = firebase.database().ref("users/" + uid);

        profile.update({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            isAdmin: userData.isAdmin
                // manager: userData.manager 
                // MANAGER TO BE COMPLETED USING AUTOCOMPLETE
        }).then(function() {
            Materialize.toast('Profile updated', 1250, 'toastAddCollab');
            $state.go('adminUserProfile', { userId: uid }, { reload: true });
        }).catch(function(err) {
            Materialize.toast('Updates failed', 1250, 'toastDeleted');
        })
    };

    //send password reset e-mail
    $scope.sendPasswordReset = function() {
        var profile = firebase.database().ref("users/" + uid);

        Auth.$sendPasswordResetEmail(profile.email)
            .then(function() { Materialize.toast('Password reset email sent', 1250, 'toastAddCollab') })
            .catch(function(err) { Materialize.toast('Password reset failed', 1250, 'toastDeleted') });
    };

    function deleteUser() {
        var profile = firebase.database().ref("users/" + uid);
        profile.child('deletedUser').transaction(function(current) {
            return true;
        }, function(error, committed, snapshot) {
            if (error) {
                console.log(error);
            } else {
                Materialize.toast('User deactivated', 1250, 'toastDeleted');
                $state.go('adminUserProfile', { userId: uid }, { reload: true });
            }
        });
    };

    $scope.deleteUserWithWarning = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to deactivate this user?')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            deleteUser();
        });
    };



    $scope.activateUser = function() {
        var profile = firebase.database().ref("users/" + uid);
        profile.child('deletedUser').transaction(function(current) {
            return false;
        }, function(error, committed, snapshot) {
            if (error) {
                console.log(error);
            } else {
                Materialize.toast('User reactivated', 1250, 'toastCreated');
                $state.go('adminUserProfile', { userId: uid }, { reload: true });
            }
        });
    };


});
