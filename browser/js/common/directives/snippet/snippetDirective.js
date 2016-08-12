app.directive('snippet', function ($rootScope, $state) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/snippet/snippet.html',
        scope: {
            title: '=title',
            body: '=body',
            collaborators: '=collaborators'
        },
        link: function(scope, element, attributes) {
        }
    };
});
