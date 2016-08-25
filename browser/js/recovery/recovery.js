app.config(function($stateProvider) {

    $stateProvider.state('recovery', {
        url: '/recovery',
        templateUrl: 'js/recovery/recovery.html',
        controller: 'RecoveryCtrl'
    });
});

app.controller('RecoveryCtrl', function($scope, $mdToast, Auth) {
    $scope.sendRecovery = function(userData) {
        if ($scope.recoveryForm.$error.email) $scope.error = 'Please enter a valid email';
        else {
            Auth.$sendPasswordResetEmail(userData.email).
            then(function() {
                Materialize.toast('Password reset e-mail sent', 1250, 'toastAddCollab');
            }).catch(function(err) {
                Materialize.toast('Password reset failed', 1250, 'toastFail');
            });
        }

    }
})
