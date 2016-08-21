app.directive('snippetTabs', function($document) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/snippet-tabs/snippet-tabs.html',
        scope: {
            activePanel: '='
        },
        compile: function() {
            return {
                pre: function(scope, elem, attrs) {
                    $document.ready(function() {
                        $('ul.tabs').tabs();
                    });
                },
                post: function(scope, elem, attrs) {

                    var activePanelType, activeTab;
                    elem.bind('click', function() {
                        activeTab = elem.find('a.active');
                        // scope.$apply(function () {
                            scope.activePanel = getPanelType(activeTab.attr('href'));
                        // })
                    })
                }
            }
        }
    }

    function getPanelType(tabTargetId) {
        if (tabTargetId === '#all-tab-panel') return 'all'
        else if (tabTargetId === '#my-tab-panel') return 'mine'
        else if (tabTargetId === '#team-tab-panel') return 'team'
        else if (tabTargetId === '#collab-tab-panel') return 'collab';
    }
})
