app.directive('adminTabs', function($document) {
    return {
        restrict: 'E',
        templateUrl: 'js/admin/directives/html/admin-tabs.html',
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
