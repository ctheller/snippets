app.directive('snippet', function($rootScope, $state, Snippet, $mdExpansionPanel, Users) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/snippet/snippet.html',
        scope: {
            id: '=',
            card: '@',
            users: '='
        },
        link: function(scope, element, attributes) {

            // do a get request for snippet info from database
            // use scope.id
            scope.card = false;

            scope.snippet = {};

            scope.submitSnippet = function($event){

                if (!scope.snippet.submitted) {
                    setTimeout(scope.snippet.submitted = true, 2250);
                }
                else {
                    scope.snippet.submitted = false;
                }
            }

            element.click(function(event){
                event.preventDefault();
            })

            scope.removeCollaborator = function(userId) {
                scope.snippet.collaborators[userId] = null;
                Users.removeAsCollaborator(userId, scope.id);
            }

            Snippet.getSnippetById(scope.id).$bindTo(scope, 'snippet');

            //ng-repeat through object directly instead!!
            scope.$watch('snippet', function(newValue, oldValue) {
                if (newValue)
                    var i = 0;
                scope.collaborators = [];
                if (!scope.snippet.collaborators) return;
                for (var key in scope.snippet.collaborators) {
                    scope.collaborators[i] = {};
                    scope.collaborators[i].id = key;
                    scope.collaborators[i].photoUrl = $rootScope.users[key].photoUrl || '/files/default-profile.png';
                    i++;
                }
            }, true);

            scope.plusButton = 'http://joshiscorner.com/files/images/plusButton.png';

            scope.collapse = function() {
                $mdExpansionPanel(scope.id).collapse();
            };

        }
    };
});
