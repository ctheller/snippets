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

    $scope.sendSignup = function(loginInfo) {
            //Error handling in controller to keep HTML
            //easy to deal with instead of having a bunch
            //of hidden divs and spans
            if ($scope.loginForm.$error.email) $scope.error = 'Please enter a valid email';
            else if ($scope.loginForm.$error.minlength) $scope.error = 'Password must have at least 8 characters';
            else if ($scope.loginForm.$error.maxlength) $scope.error = 'Password must have less than 32 characters';
            else if ($scope.loginForm.$error.required) $scope.error = 'All fields are required';
            else {
                Auth.$createUserWithEmailAndPassword(loginInfo.email, loginInfo.password)
                    .then(function(userData) {
                        console.log("User " + userData.uid + " created successfully!");

                        return Auth.$signInWithEmailAndPassword(
                            loginInfo.email, loginInfo.password
                        );
                    }).then(function(authData) {
                        console.log("Logged in as:", authData.uid);
                    }).catch(function(error) {
                        console.error("Error: ", error);
                    });
            }
        };

});
