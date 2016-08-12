app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

<<<<<<< HEAD
app.controller('LoginCtrl', function($scope, Auth) {

    $scope.googleLogin = function() {
        Auth.$signInWithRedirect('google');
    };
=======
app.controller('LoginCtrl', function ($scope, AuthService) {

    $scope.googleLogin = AuthService.login;
>>>>>>> snippetKing

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {
        $scope.firebaseUser = null;
        $scope.error = null;
        console.log('auth baby', Auth);
        Auth.$signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
            .then(function(authData) {
                console.log('Logged in as:', authData.uid);
            }).catch(function(err) {
                console.log('Authentication failed:', err);
            })
    }
});
