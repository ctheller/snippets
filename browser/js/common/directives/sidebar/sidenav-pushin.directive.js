app.directive('sidenavPushIn', function($rootScope) {
    return {
        restrict: 'A',
        require: '^mdSidenav',
        link: function($scope, element, attr, sidenavCtrl) {
            var body = angular.element(document.body);
            body.addClass('md-sidenav-push-in');
            var cssClass = (element.hasClass('md-sidenav-left') ? 'md-sidenav-left' : 'md-sidenav-right') + '-open';
            var stateChanged = function(state) {
                body[state ? 'addClass' : 'removeClass'](cssClass);
            };
            // overvwrite default functions and forward current state to custom function
            angular.forEach(['open', 'close', 'toggle'], function(fn) {
                var org = sidenavCtrl[fn];
                sidenavCtrl[fn] = function() {
                    var res = org.apply(sidenavCtrl, arguments);
                    stateChanged(sidenavCtrl.isOpen());
                    return res;
                };
            });
        }
    };
});
