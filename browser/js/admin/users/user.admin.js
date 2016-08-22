app.controller('AdminProfileCtrl', function($scope, $rootScope, $stateParams) {

    //set userID equal to the stateParams $id being passed in
    let uid = $stateParams.userId;

    //put all info for specific user we are querying on the scope
    firebase.database().ref("users/" + uid).once('value')
        .then(function(snapshot) {
            $scope.userCopy = snapshot.val();

            // filter out the managerId
            var managerObj = $rootScope.users.filter(function(user) {
                return user.$id === $scope.userCopy.manager;
            });

            var manager_name = "";

            if (managerObj.length > 0) {
                manager_name = managerObj[0].first_name + ' ' + managerObj[0].last_name;
            } else { manager_name = "" }

            angular.extend($scope.userCopy, { 'manager_name': manager_name });

        })
        .catch(function(err){
            console.log(err)
        })

    // updates the profile upon clicking submit
    $scope.saveProfile = function(userData) {

        var profile = firebase.database().ref("users/" + uid);
        console.log('profile', profile);

        profile.update({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            manager: userData.manager
        }).then(function() {
            console.log('Synchronization success');
        }).catch(function(err) {
            console.log('Synchronization failed, error code:', err);
        })
    }

    //send password reset e-mail
    $scope.sendPasswordReset = function() {
        var profile = firebase.database().ref("users/" + uid);

        Auth.$sendPasswordResetEmail(profile.email)
            .then(function() { console.log('Password reset email sent') })
            .catch(function(err) { console.log('Password reset email failed to send. Error code:', err) });
    }
});
