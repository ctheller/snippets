app.directive('snippetTabs', function($document) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/snippet-tabs/snippet-tabs.html',
        compile: function () {
            return {
                pre: function () {
                    $document.ready(function () {
                        $('ul.tabs').tabs();
                    })
                }
            }
        }
    }
})
