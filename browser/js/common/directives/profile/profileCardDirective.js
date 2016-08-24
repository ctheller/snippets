app.directive('profileCard', function($rootScope, AuthService, $state, $document) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/profile/profileCard.html',
        scope: {
            user: '='
        },
        link: function(scope, element, attr) {

            scope.logout = function() {
                scope.isPopupVisible = false;
                AuthService.logout();
            };

            scope.isPopupVisible = false;

            scope.toggleSelect = function() {
                scope.isPopupVisible = !scope.isPopupVisible;
            };

            scope.editProfile = function(){
                scope.isPopupVisible = false;
                $state.go('profile', {userId: scope.user.$id});
            };

            $document.on('click', function(event) {
                var isClickedElementChildOfPopup = element
                    .find(event.target)
                    .length > 0;

                if (isClickedElementChildOfPopup)
                    return;

                scope.isPopupVisible = false;
                scope.$apply();
            });
        }
    };
});
