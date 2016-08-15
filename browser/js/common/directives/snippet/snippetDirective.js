app.directive('snippet', function($rootScope, $state, Snippet, $mdExpansionPanel) {
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

            scope.removeCollaborator = function(id) {
                scope.snippet.collaborators[id] = null;
            }

            Snippet.getSnippetById(scope.id).$bindTo(scope, 'snippet');

            scope.$watch('snippet', function(newValue, oldValue) {
                if (newValue)
                    var i = 0;
                scope.collaborators = [];
                if (!scope.snippet.collaborators) return;
                for (var key in scope.snippet.collaborators) {
                    scope.collaborators[i] = {};
                    scope.collaborators[i].id = key;
                    scope.collaborators[i].photoUrl = $rootScope.users[key].photoUrl || 'https://lh3.googleusercontent.com/-E-QnbqHCvOE/AAAAAAAAAAI/AAAAAAAAADU/03NFp88Q3uk/s180-p-k-rw-no/photo.jpg';
                    i++;
                }
            }, true);

            scope.plusButton = 'http://joshiscorner.com/files/images/plusButton.png';

            scope.collapse = function() {
                $mdExpansionPanel(scope.id).collapse();
            };


            // after it comes back set scope.title, body, collaborator

            // get profile image urls of those collaborators
            // for each to return array of urls


            // scope.collaborators = ['http://joshiscorner.com/files/images/plusButton.png','https://lh3.googleusercontent.com/-E-QnbqHCvOE/AAAAAAAAAAI/AAAAAAAAADU/03NFp88Q3uk/s180-p-k-rw-no/photo.jpg', 'https://lh3.googleusercontent.com/-bOjCfXB8_qU/AAAAAAAAAAI/AAAAAAAAATw/6LnoMFC_ZUc/s180-p-k-rw-no/photo.jpg','http://lh3.googleusercontent.com/-50q0RpvFY0I/AAAAAAAAAAI/AAAAAAAAD6w/rX8SRDUvwds/s180-p-k-rw-no/photo.jpg','https://lh3.googleusercontent.com/-AqkAdKInFSU/AAAAAAAAAAI/AAAAAAAAAAA/AOkcYItBC05GD1jyQ8k3kYGmnmBCn20N7w/s192-c-mo/photo.jpg'];
        }
    };
});
