app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, Auth) {

    $scope.googleLogin = function() {
        Auth.$signInWithRedirect('google');
    };

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
