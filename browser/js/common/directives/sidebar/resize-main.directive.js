app.directive('resizeMain', function($rootScope, $document, $window) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var sidebarWidth = 200;
            var body = angular.element($document[0].body);
            var sidebarOpen = false;
            angular.element($window).bind('resize', function() {
                if (!sidebarOpen) element.css({'max-width': body[0].clientWidth + 'px', 'transition': 'width 0.5s ease'});
                else element.css({'max-width': body[0].clientWidth - sidebarWidth + 'px', 'transition': 'width 0.5s ease'});
            });
            $rootScope.$on('open', function() {
                element.css({'max-width': body[0].clientWidth - sidebarWidth + 'px', 'transition': 'width 0.5s ease'});
                sidebarOpen = true;
            });
            $rootScope.$on('close', function() {
                element.css({'max-width': body[0].clientWidth + 'px', 'transition': 'width 0.5s ease'});
                sidebarOpen = false;
            });
        }
    };
});
