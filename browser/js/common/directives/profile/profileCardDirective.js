app.directive('profileCard', function($rootScope, $state, $document) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/profile/profileCard.html',
        scope: {
            isPopupVisible: '=',
            toggleOff: '&',
            user: '='
        },
        link: function(scope, el, attr) {
            $document.on('click', function(e) {
                if (el !== e.target && !el[0].contains(e.target)) {
                    console.log('clicked outside of me');
                    scope.$apply(function() {
                        scope.toggleOff();
                    });
                }
            });
        }
    };
});
