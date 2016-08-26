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

    app.service('AuthService', function ($rootScope, AUTH_EVENTS, Auth, $state, $firebaseObject, Organizations, Users) {

        var user = null;

        $rootScope.siteLoaded = false;

        this.login = function(){
            Auth.$signInWithRedirect('google');
            $state.go('dashboard.week', {week: 0});
        };

        var unbindUser;

        this.getLoggedInUser = function(){
            return $rootScope.user;
        }

        var setUser = function(){
            if (Auth.$getAuth()) {

                var id = Auth.$getAuth().uid;

                //check if user is in the DB already
                var ref = firebase.database().ref().child('users');

                //Get user info from db:
                user = $firebaseObject(ref.child(id));
                $rootScope.userFirebaseObj = user;

                user.$bindTo($rootScope, 'user').then(function(unbind){

                    unbindUser = unbind;
                    //Set up listeners for Collaboration
                    var initializing = true;
                    ref.child(id).child('snippets').child('asCollaborator').on('child_added', function(){
                        if (!initializing) Materialize.toast('Added as Collaborator', 1250, 'toastAddCollab');
                    });
                    ref.child(id).child('snippets').child('asManager').on('child_added', function(){
                        if (!initializing) Materialize.toast('Received new Snippet', 1250, 'toastAddCollab');
                    });
                    initializing = false;
                    ref.child(id).child('snippets').child('asCollaborator').on('child_removed', function(){
                        Materialize.toast('Removed as Collaborator', 1250, 'toastDeleted');
                    });
                    ref.child(id).child('snippets').child('asManager').on('child_removed', function(){
                        Materialize.toast('Report Snippet Removed', 1250, 'toastDeleted');
                    });


                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    Organizations.get().$loaded().then(function(org){
                        $rootScope.organization = org;
                        Users.getUsers(Object.keys(org.users)).then(function(result){
                            $rootScope.users = result;
                            $rootScope.siteLoaded = true;
                        })
                    })
                })
            } else {
                $rootScope.siteLoaded = true;                
            }
        };

        this.logout = function(){
            if (unbindUser) {
                unbindUser();
            }
            $rootScope.user = null;
            $rootScope.users = null;
            $rootScope.userRef = null;
            $rootScope.org = null;
            $rootScope.siteLoaded = true;
            Auth.$signOut();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            $state.go('splash', { reload: true });
        }

        var first = true;
        Auth.$onAuthStateChanged(function(result){
            setUser();
            if (result && !first) {
                $state.go('dashboard.week', {week: 0});
            } 
            first = false;    
        });

    });

})();
