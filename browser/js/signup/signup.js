app.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'signUpCtrl'
    });
});

app.controller('signUpCtrl', 

    function($scope, $state, $rootScope, Auth) {
        $scope.error = null;

        $scope.sendSignup = function(signupInfo) {
            //Error handling in controller to keep HTML
            //easy to deal with instead of having a bunch
            //of hidden divs and spans
            if ($scope.signupForm.$error.email) $scope.error = 'Please enter a valid email';
            else if ($scope.signupForm.$error.minlength) $scope.error = 'Password must have at least 8 characters';
            else if ($scope.signupForm.$error.maxlength) $scope.error = 'Password must have less than 32 characters';
            else if ($scope.signupForm.$error.required) $scope.error = 'All fields are required';
            else {
                Auth.$createUserWithEmailAndPassword(signupInfo.email, signupInfo.password)
                    .then(function(userData) {
                        console.log("User " + userData.uid + " created successfully!");

                        return Auth.$signInWithEmailAndPassword(
                            signupInfo.email, signupInfo.password
                        );
                    }).then(function(authData) {
                        console.log("Logged in as:", authData.uid);
                    }).catch(function(error) {
                        console.error("Error: ", error);
                    });
            }
        };

        $scope.deleteUser = function() {
        	$scope.message = null;
        	$scope.error = null;

        	Auth.$deleteUser().then(function(){
        		$scope.message = "User deleted";
        	}).catch(function(err){
        		$scope.error = err;
        	});
        };
    }
);
