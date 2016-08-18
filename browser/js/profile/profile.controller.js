app.controller('ProfileCtrl', function($scope, $rootScope, $mdDialog, Auth, Users, $firebaseObject) {

    // fetches the user's unique id to look up the user profile
    var uid = Auth.$getAuth().uid;

    $scope.userCopy = angular.copy($rootScope.user);

    var managerObj = $rootScope.users.filter(function(user) {
        return user.$id === $scope.userCopy.manager;
    });

    var manager_name = "";

    if(managerObj.length > 0){
        manager_name = managerObj[0].first_name + ' ' + managerObj[0].last_name;    
    } else { manager_name = ""}
    
    angular.extend($scope.userCopy, {'manager_name': manager_name});

    // updates the profile upon clicking submit
    $scope.saveProfile = function(userData) {

        var profile = firebase.database().ref("users").child(uid);
        console.log('profile', profile);

        // console.log('what dis', Users.getProfile(uid));
        // console.log('dis is da userdata', userData);
        profile.update({
            first_name: userData.first_name,
            last_name: userData.last_name,
            manager: userData.manager
        }).then(function() {
            console.log('Synchronization success');
        }).catch(function(err) {
            console.log('Synchronization failed, error code:', err);
        })
    }

    $scope.sendPasswordReset = function(){
        console.log(Auth);
        Auth.$sendPasswordResetEmail($scope.userCopy.email)
        .then(function(){console.log('Password reset email sent')})
        .catch(function(err){console.log('Password reset email failed to send. Error code:', err)});
    }
});