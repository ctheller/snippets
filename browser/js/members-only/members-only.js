app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        templateUrl: 'js/members-only/members-only.html',
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: false
        }
    });

});
