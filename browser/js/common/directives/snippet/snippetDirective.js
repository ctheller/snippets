app.directive('snippet', function ($rootScope, $state) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/snippet/snippet.html',
        scope: {
            id: '=',
        },
        link: function(scope, element, attributes) {
            // do a get request for snippet info from database
            // use scope.id

            // after it comes back set scope.title, body, collaborators

            // filler for now
            scope.title = 'Launched SuperApp to seven new markets';
            scope.body = 'Dragée marshmallow cupcake donut macaroon. Liquorice jelly-o liquorice jelly-o. Apple pie tootsie roll danish marzipan chocolate cake icing jelly beans lollipop. Chocolate toffee ice cream toffee candy. Dragée marshmallow cupcake donut macaroon. Liquorice jelly-o liquorice jelly-o. Apple pie tootsie roll danish marzipan chocolate cake icing jelly beans lollipop. Chocolate toffee ice cream toffee candy.';

            // get profile image urls of those collaborators
            // for each to return array of urls

            scope.collaborators = ['https://lh3.googleusercontent.com/-AqkAdKInFSU/AAAAAAAAAAI/AAAAAAAAAAA/AOkcYItBC05GD1jyQ8k3kYGmnmBCn20N7w/s192-c-mo/photo.jpg','http://lh3.googleusercontent.com/-50q0RpvFY0I/AAAAAAAAAAI/AAAAAAAAD6w/rX8SRDUvwds/s180-p-k-rw-no/photo.jpg','https://lh3.googleusercontent.com/-E-QnbqHCvOE/AAAAAAAAAAI/AAAAAAAAADU/03NFp88Q3uk/s180-p-k-rw-no/photo.jpg', 'https://lh3.googleusercontent.com/-bOjCfXB8_qU/AAAAAAAAAAI/AAAAAAAAATw/6LnoMFC_ZUc/s180-p-k-rw-no/photo.jpg'];
        }
    };
});
