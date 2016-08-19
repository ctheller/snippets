app.directive('resizeMain', function($rootScope, $document, $window) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var sidebarWidth = 200;
            var body = angular.element($document[0].body);
            var sidebarOpen = false;
            var resetPushedWidth = function() {
                element.css({ 'max-width': body[0].clientWidth - sidebarWidth + 'px', 'transition': 'width 0.5s ease' });
            }
            var resetExpandedWidth = function() {
                element.css({ 'max-width': body[0].clientWidth + 'px', 'transition': 'width 0.5s ease' });
            }
            var resetWidthOnSidebarEvent = function() {
                if (!sidebarOpen) resetExpandedWidth()
                else resetPushedWidth()
            }
            resetWidthOnSidebarEvent();
            angular.element($window).bind('resize', function() {
                resetWidthOnSidebarEvent();
            });
            $rootScope.$on('open', function() {
                resetPushedWidth()
                sidebarOpen = true;
            });
            $rootScope.$on('close', function() {
                resetExpandedWidth()
                sidebarOpen = false;
            });
        }
    };
});
