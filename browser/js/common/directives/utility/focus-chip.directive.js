app.directive('focusChip', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            // elem on focus
            // set parents background to white
            var searchbar = $document.find('advancedSearchBox');
            var searchbox = $document.find('input[name="searchbox"]');
            elem.bind('click', function () {
                console.log(searchbar)
                searchbar.css({
                    backgroundColor:'white',
                    transition: 'background-color 0.1s ease'
                });
            });
            elem.bind('focus', function () {
                console.log(searchbar)
                searchbar.css({
                    backgroundColor:'white',
                    transition: 'background-color 0.1s ease'
                });
            });
        }
    }
})
