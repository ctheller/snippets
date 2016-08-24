app.controller('AdminProfileCtrl', function($scope, $rootScope, $mdDialog, $state, $stateParams) {

    //set userID equal to the stateParams $id being passed in
    let uid = $stateParams.userId;

    var user;
    var manager;
    $scope.userCopy = {};

    function getUserPromise(id) {
        return firebase.database().ref("users/" + id).once('value').then(function(snapshot) {
            return snapshot.val();
        });
    };

    // we get the user info using our promise function
    var getUser = getUserPromise(uid);

    // after we get the user info, we fetch the profile information for his/her manager
    var getManager = getUser.then(function(user) {
        return getUserPromise(user.manager)
    });

    // run all the requests, then combine the results and put them on the scope
    Promise.all([getUser, getManager]).then(function(results) {
        angular.extend($scope.userCopy, results[0]);
        $scope.userCopy.manager_name = results[1].first_name + ' ' + results[1].last_name;
    });

    // updates the profile upon clicking submit
    $scope.saveProfile = function(userData) {
        var profile = firebase.database().ref("users/" + uid);

        profile.update({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email
                // manager: userData.manager 
                // MANAGER TO BE COMPLETED USING AUTOCOMPLETE
        }).then(function() {
            console.log('Synchronization success');
        }).catch(function(err) {
            console.log('Synchronization failed, error code:', err);
        })
    };

    //send password reset e-mail
    $scope.sendPasswordReset = function() {
        var profile = firebase.database().ref("users/" + uid);

        Auth.$sendPasswordResetEmail(profile.email)
            .then(function() { console.log('Password reset email sent') })
            .catch(function(err) { console.log('Password reset email failed to send. Error code:', err) });
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

    $scope.userStatus = function() {
        if ($scope.userCopy) {
            console.log('hello');
        }
    }

});
