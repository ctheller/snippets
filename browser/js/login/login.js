app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, $mdToast, $state, AuthService, Auth) {

    $scope.googleLogin = AuthService.login;

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {
        $scope.firebaseUser = null;
        $scope.error = null;
        Auth.$signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
            .then(function(authData) {
                Materialize.toast('Login Successful', 1250, 'toastSubmitted');
                $state.go('dashboard.week');
            }).catch(function(err) {
                Materialize.toast('Incorrect Email/Password', 1250, 'toastDeleted');
            });
    };

});
