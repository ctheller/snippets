app.directive('overflowMargin', function($document) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var expansionPanelContainer = $document.find('.expansion-panel-container');
            var allContainer = $document.find('md-expansion-panel-group#all-panel');
            var mineContainer = $document.find('md-expansion-panel-group')[1];
            var teamContainer = $document.find('md-expansion-panel-group')[2];
            var collabContainer = $document.find('md-expansion-panel-group')[3];
            $document.bind('ready', function(e) {
                console.log()
                setMarginTopOfTheFirstPanel($document.find('md-expansion-panel-group')[0])
            })
            $document.bind('click', function(e) {
                console.log()
                setMarginTopOfTheFirstPanel($document.find('md-expansion-panel-group')[0])
            })
            function setMarginTopOfTheFirstPanel(container) {
                console.log(container)
                console.log(container.clientHeight)
                console.log(expansionPanelContainer)
                console.log(expansionPanelContainer.height())
                if ((container.clientHeight < expansionPanelContainer.height())) {
                    console.log('here')
                    container.css({
                        'position': 'relative',
                        'top': '48px'
                    })
                    console.log('here', container[0].style.top)
                } else {
                    container.css({
                        'position': 'relative',
                        'top': '0'
                    })
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
