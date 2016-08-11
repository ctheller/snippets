app.directive('snippet', function ($rootScope, AuthService, AUTH_EVENTS, $state) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/snippet/snippet.html',
        scope: {
          readonly: '=?',
          user: '=',
            data: '=ngModel',
            snippetId: '='
        },
        link: function(scope, element, attributes) {
        }
    };
});
