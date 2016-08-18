app.directive('profileCard', function($rootScope, Auth, $state, $document) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/profile/profileCard.html',
        scope: {
            user: '='
        },
        link: function(scope, element, attr) {

            scope.logout = function() {
                Auth.$signOut();
                scope.isPopupVisible = false;
                $rootScope.users = null;
                $state.go('login');
            };

            scope.isPopupVisible = false;

            scope.toggleSelect = function() {
                scope.isPopupVisible = !scope.isPopupVisible;
            }

            scope.editProfile = function(){
                scope.isPopupVisible = false;
                $state.go('profile');
            }

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
