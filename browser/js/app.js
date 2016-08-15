'use strict';

window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ngAnimate', 'ngMaterial', 'ngAria', 'ngMessages', 'angularResizable', 'firebase', 'ngDragDrop', 'ngSanitize', 'material.components.expansionPanels']);

app.config(function($urlRouterProvider, $locationProvider, $mdThemingProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function() {
        window.location.reload();
    });

    $mdThemingProvider.theme('indigo')
        .primaryPalette('indigo')
        .accentPalette('pink');

    $mdThemingProvider.theme('blue')
        .primaryPalette('blue')
        .accentPalette('orange')
        .warnPalette('green');

    // This is the absolutely vital part, without this, changes will not cascade down through the DOM.
    $mdThemingProvider.alwaysWatchTheme(true);
})



// This app.run is for controlling access to specific states.
app.run(function($rootScope, AuthService, $state, Users) {

    Users.getAll().$bindTo($rootScope, 'users');

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();


        if (AuthService.getLoggedInUser()) {
            $state.go(toState.name, toParams);
        } else {
            $state.go('login');
        }

    });

});
