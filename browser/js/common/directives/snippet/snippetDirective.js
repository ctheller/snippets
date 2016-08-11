app.directive('snippet', function ($rootScope, AuthService, AUTH_EVENTS, $state, socketio) {
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
            // need to put snippetId on the scope
            // if (!readonly) {
            //     socketio.emit('joinSnippetRoom', scope.snippetId);
            // }

            // //need a function that watches snippet contents
            // scope.$watch('data', function(oldValue, newValue) {
            //     if (newValue) {
            //         socketio.emit('edit', {snippetId: snippetId, changes: newValue})
            //     }
            // });

            // socketio.on('edited', function(data){
            //     scope.data = data;
            // })
        }
    };
});
