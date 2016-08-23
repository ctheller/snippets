app.controller('ProfileCtrl', function($scope, $rootScope, $stateParams, $mdDialog, Auth) {

    // fetches the user's unique id from the $stateParams to look up the user profile
    var uid = $stateParams.userId;

    var user;
    var manager;
    $scope.userCopy = {};

    function getUserPromise(id){
        return firebase.database().ref("users/" + id).once('value').then(function(snapshot){
            return snapshot.val();
        });
    }

    // we get the user info using our promise function
    var getUser = getUserPromise(uid);

    // after we get the user info, we fetch the profile information for his/her manager
    var getManager = getUser.then(function(user){
        return getUserPromise(user.manager)
    })

    // run all the requests, then combine the results and put them on the scope
    Promise.all([getUser, getManager]).then(function(results){
        angular.extend($scope.userCopy, results[0]);
        $scope.userCopy.manager_name = results[1].first_name + ' ' + results[1].last_name;
    });

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

    $scope.sendPasswordReset = function() {
        console.log(Auth);
        Auth.$sendPasswordResetEmail($scope.userCopy.email)
            .then(function() { console.log('Password reset email sent') })
            .catch(function(err) { console.log('Password reset email failed to send. Error code:', err) });
    }

    $scope.$on('$stateChangeStart', function() {
        $element.remove();
    });
});
