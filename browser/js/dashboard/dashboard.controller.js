app.controller('DashboardCtrl', function($rootScope, $scope, $mdDialog, MdHelpers, AUTH_EVENTS, Snippet, Email) {

    $scope.dragOn = function(){
        $scope.draggingNow = true;
    }

    $scope.dateInRange = function(date){
        return ((date - $scope.currentWeek)/(1000*60*60*24) < 7 && (date - $scope.currentWeek)/(1000*60*60*24) > 0);
    }

    var setScope = function(){
        $scope.allSnippetIds = Snippet.getSnippetIdsWithInfo($rootScope.user);
    }

    //on page refresh or initial login
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
        setScope();
        $rootScope.transitionedToDash = true;
        $scope.userFirebaseObj.$watch(function() {
            console.log('scope set login');
            setScope();
        })
    });

    //to return to state and see things
    if ($scope.user) {
        setScope();
        if (!$rootScope.transitionedToDash) {
            $scope.userFirebaseObj.$watch(function() {
                console.log('scope set state change');
                setScope();
            });
            $rootScope.transitionedToDash = true;
        }
    }

    $scope.card = true;
    $scope.dragged = [];

    $scope.toggle = function() {
        $mdSidenav('right').toggle();
        if ($mdSidenav('right').isOpen()) $rootScope.$emit('open');
        else $rootScope.$emit('close');
    };

    $scope.newSnippet = {};

    $scope.draggables = [
        { icon: 'people' }, { icon: 'person' }
    ];

    $scope.createNewSnippet = function(e, ui) {
        var snippetCopyId = ui.draggable.scope().key;
        Snippet.duplicateAsTemplate(snippetCopyId).then(function(){
            Materialize.toast('Snippet copied', 1250, 'toastCopied');
        }).catch(function(){
            Materialize.toast('Copy Failed', 2000, 'toastFail');
        })
    }


    // $scope.selectSnippet = function(e, ui){
    //     if (!$rootScope.selectedSnippetIds) $rootScope.selectedSnippetIds = [];
    //     var snippetId = ui.draggable.scope().obj.id;
    //     var idx = $rootScope.selectedSnippetIds.indexOf(snippetId);
    //     if (idx === -1) {
    //         $rootScope.selectedSnippetIds.push(snippetId);
    //     }
    //     console.log($rootScope.selectedSnippetIds);
    // }

    $scope.exportToEmail = function(){
        Email.compose();
    }

});
