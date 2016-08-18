app.config(function ($stateProvider) {
    $stateProvider.state('splash', {
        url: '/splash',
        templateUrl: 'js/splashPage/splash.html',
        controller: 'SplashCtrl'
    });
});

