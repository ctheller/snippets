app.config(function($stateProvider) {

    $stateProvider.state('recovery', {
        url: '/recovery',
        templateUrl: 'js/recovery/recovery.html',
        controller: 'RecoveryCtrl'
    });
});

app.controller('RecoveryCtrl', function($scope, $mdToast, Auth, $state) {
    $scope.sendRecovery = function(userData) {
        if ($scope.recoveryForm.$error.email) $scope.error = 'Please enter a valid email';
        else {
            console.log(userData);
            Auth.$sendPasswordResetEmail(userData.email).
            then(function() {
                var last = {
                    bottom: false,
                    top: false,
                    left: false,
                    right: false
                };

                $scope.toastPosition = angular.extend({}, last);

                $scope.getToastPosition = function() {
                    sanitizePosition();

                    return Object.keys($scope.toastPosition)
                        .filter(function(pos) {
                            return $scope.toastPosition[pos];
                        })
                        .join(' ');
                };

                function sanitizePosition() {
                    var current = $scope.toastPosition;

                    if (current.bottom && last.top) current.top = false;
                    if (current.top && last.bottom) current.bottom = false;
                    if (current.right && last.left) current.left = false;
                    if (current.left && last.right) current.right = false;

                    last = angular.extend({}, current);
                }

                var pinTo = $scope.getToastPosition();

                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Password reset e-mail sent. Please check your inbox.')
                    .position(pinTo)
                    .hideDelay(5000)
                );
            }).catch(function(err) {
                console.log('Password reset failed failed:', err);
                var last = {
                    bottom: false,
                    top: true,
                    left: false,
                    right: true
                };

                $scope.toastPosition = angular.extend({}, last);

                $scope.getToastPosition = function() {
                    sanitizePosition();

                    return Object.keys($scope.toastPosition)
                        .filter(function(pos) {
                            return $scope.toastPosition[pos];
                        })
                        .join(' ');
                };

                function sanitizePosition() {
                    var current = $scope.toastPosition;

                    if (current.bottom && last.top) current.top = false;
                    if (current.top && last.bottom) current.bottom = false;
                    if (current.right && last.left) current.left = false;
                    if (current.left && last.right) current.right = false;

                    last = angular.extend({}, current);
                }

                var pinTo = $scope.getToastPosition();

                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Error sending password reset. Please try again')
                    .position(pinTo)
                    .hideDelay(3000)
                );
            });
        }

    }

    // $scope.sendPasswordReset = function(){
    //        console.log(Auth);
    //        Auth.$sendPasswordResetEmail($scope.userCopy.email)
    //        .then(function(){console.log('Password reset email sent')})
    //        .catch(function(err){console.log('Password reset email failed to send. Error code:', err)});
    //    }
})
