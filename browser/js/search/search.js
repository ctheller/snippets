app.config(function ($stateProvider) {

    $stateProvider.state('search', {
        url: '/search',
        controller: 'SearchCtrl',
        templateUrl: 'js/search/search.html',
        params: {'result': null, 'type': null, 'goBackTo': null}

    });

});
