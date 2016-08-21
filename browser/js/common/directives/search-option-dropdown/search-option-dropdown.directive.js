app.directive('searchOptionDropdown', function($document) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/search-option-dropdown/search-option-dropdown.html',
        scope: {

        },
        compile: function() {
            return {
                pre: function(scope, elem, attrs) {
                    $document.ready(function() {
                        $('.dropdown-button').dropdown({
                            inDuration: 300,
                            outDuration: 225,
                            constrain_width: false,
                            hover: true,
                            gutter: 0,
                            belowOrigin: false,
                            alignment: 'left'
                        })
                    });
                },
                post: function(scope, elem, attrs) {
                    console.log('hello?')
                    $document.on('click', function() {
                        console.log('click', elem)
                        var searchOption = elem.find('a').attr('href');
                        console.log('hello', searchOption);
                    })
                }
            }
        }
    }
})
