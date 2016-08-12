app.directive('resizeMain', function($rootScope, $document, $window) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var sidebarWidth = 320;
            var body = angular.element($document[0].body);
            var sidebarOpen = false;
            angular.element($window).bind('resize', function() {
                if (!sidebarOpen) element.css('max-width', body[0].clientWidth + 'px');
                else element.css('max-width', body[0].clientWidth - sidebarWidth + 'px');
            });
            $rootScope.$on('open', function() {
                element.css('max-width', body[0].clientWidth - sidebarWidth + 'px');
                sidebarOpen = true;
            });
            $rootScope.$on('close', function() {
                element.css('max-width', body[0].clientWidth + 'px');
                sidebarOpen = false;
            });
        }
    };
});
