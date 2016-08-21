app.directive('overflowMargin', function($document) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var uiView = $document.find('.dashboard-ui-view-wrapper ui-view')[0];
            var allContainer = $document.find('md-expansion-panel-group')[0];
            var mineContainer = $document.find('md-expansion-panel-group')[1];
            var teamContainer = $document.find('md-expansion-panel-group')[2];
            var collabContainer = $document.find('md-expansion-panel-group')[3];
            $document.bind('click', function(e) {
                console.log(e.target)
                var $panelGroup = findContainer(angular.element(e.target))
                setMarginTopOfTheFirstPanel(allContainer)
            })
            function setMarginTopOfTheFirstPanel(container) {
                if ((container.clientHeight < uiView.clientHeight)) {
                    angular.element(container)[0].style['position'] = 'relative';
                    angular.element(container)[0].style['top'] = '48px';
                } else {
                    angular.element(container)[0].style['position'] = 'relative';
                    angular.element(container)[0].style['top'] = '0px';
                }
            }
            function findContainer ($elem) {
                if ($elem.parent().attr('md-component-id') === 'all-panel' || $elem.parent().attr('md-component-id') === 'my-panel' || $elem.parent().attr('md-component-id') === 'team-panel' || $elem.parent().attr('md-component-id') === 'collab-panel') {
                    return $elem.parent();
                } else {
                    return findContainer($elem.parent());
                }
            }
        }
    }


})
