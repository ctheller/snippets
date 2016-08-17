app.directive('focusInput', function($document) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var searchbox = elem.find('input[name="searchbox"]');

            elem.bind('click', function() {
                searchbox.focus();
                elem.css({
                    backgroundColor: 'white',
                    transition: 'background-color 0.1s ease'
                });
            });
            searchbox.bind('click', function() {
                elem.css({
                    backgroundColor: 'white',
                    transition: 'background-color 0.1s ease'
                });
            });
            searchbox.focusout(function() {
                if ($('input[name="value"]').length === 0) {
                    elem.css({
                        backgroundColor: '#64b5f6',
                        transition: 'background-color 0.1s ease'
                    });
                }

            });
        }
    }
});
