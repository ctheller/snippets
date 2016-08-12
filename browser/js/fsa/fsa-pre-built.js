(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function (response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });

    app.service('AuthService', function ($rootScope, AUTH_EVENTS, Auth, $state, $firebaseObject) {

        var user = null;

        this.getLoggedInUser = function () {
            return user;
        };
    

        this.login = function(){
            Auth.$signInWithRedirect('google');
        };

        Auth.$onAuthStateChanged(function(){
            if (Auth.$getAuth()) {
                var id = Auth.$getAuth().uid;

                //check if user is in the DB already
                var ref = firebase.database().ref().child('users');
                ref.once('value', function(snapshot){
                    if (!snapshot.hasChild(Auth.$getAuth().uid)) {
                        var email = Auth.$getAuth().providerData[0].email;
                        var photoUrl = Auth.$getAuth().providerData[0].photoURL;
                        ref.child(id).set({email: email, photoUrl: photoUrl, isAdmin: false});
                    }
                });
<<<<<<< HEAD

                //console.log('5', $firebaseObject(ref.child('users').hasChild('5')));

                //change this to get user info from db:
                user = Auth.$getAuth();

=======
                //Get user info from db:
                user = $firebaseObject(ref.child(id));
>>>>>>> snippetKing
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

            }
            else {
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                $state.go('home');
            }
        });

    });

})();
