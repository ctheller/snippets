app.directive('focusInput', function($document, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var searchbox = elem.find('input[name="searchbox"]');
            var searchbtn = $document.find('#elasticsearch-btn');
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
                setActive();
                searchbox.val('');
                $rootScope.$emit('clearNgModel')
            });
            searchbox.bind('click', function() {
                setActive();
                searchbox.val('');
                $rootScope.$emit('clearNgModel')
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
                elem.removeClass('z-depth-2');
            });
            searchbox.focus(function() {
                $document.bind("keypress", function(event) {
                    searchbtn.click();
                });
            })
        }
    }
});
