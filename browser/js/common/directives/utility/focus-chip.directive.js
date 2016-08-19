app.directive('focusChip', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var searchbar = $document.find('advancedSearchBox');
            var searchbox = $document.find('input[name="searchbox"]');
            var searchbtn = $document.find('.search-btn');
            elem.bind('click', function () {
                searchbar.css({
                    backgroundColor:'white',
                    transition: 'background-color 0.1s ease'
                });
                searchbtn.css({
                    color: '#64b5f6'
                });
                searchbar.removeClass('z-depth-2');
            });
            elem.bind('focus', function () {
                searchbar.css({
                    backgroundColor:'white',
                    transition: 'background-color 0.1s ease'
                });
                searchbtn.css({
                    color: '#64b5f6'
                });
                searchbar.removeClass('z-depth-2');
            });
            elem.focusout(function () {
                searchbar.removeClass('z-depth-2');
            });
            searchbox.focusout(function () {

            })
        }
    }
})
