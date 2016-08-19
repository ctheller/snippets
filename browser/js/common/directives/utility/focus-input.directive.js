app.directive('focusInput', function($document) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var searchbox = elem.find('input[name="searchbox"]');
            var searchbtn = $document.find('.search-btn');
            var setActive = function() {
                elem.css({
                    backgroundColor: 'white',
                    transition: 'background-color 0.1s ease'
                });
                searchbtn.css({
                    color: '#64b5f6'
                });
                elem.addClass('z-depth-2');
            }
            elem.bind('click', function() {
                searchbox.focus();
                setActive()
            });
            searchbox.bind('click', function() {
                setActive();
            });
            searchbox.focusout(function() {
                if ($('input[name="value"]').length === 0) {
                    elem.css({
                        backgroundColor: '#64b5f6',
                        transition: 'background-color 0.1s ease'
                    });
                    searchbtn.css({
                        color: 'white'
                    });
                }
                searchbox.val('');
                elem.removeClass('z-depth-2');

            });
        }
    }
});
