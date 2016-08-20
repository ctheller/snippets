app.controller('DashboardCtrl', function($rootScope, $scope, $mdDialog, MdHelpers, AUTH_EVENTS, Snippet, Email, $mdExpansionPanel) {

    $scope.dragOn = function() {
        $scope.draggingNow = true;
    }

    $scope.dateInRange = function(date) {
        return ((date - $scope.currentWeek) / (1000 * 60 * 60 * 24) < 7 && (date - $scope.currentWeek) / (1000 * 60 * 60 * 24) > 0);
    }

    var setScope = function() {
        $scope.allSnippetIds = Snippet.getSnippetIdsWithInfo($rootScope.user);
    }

    //on page refresh or initial login
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
        setScope();
        if ($rootScope.unwatchUser) $rootScope.unwatchUser();
        $rootScope.unwatchUser = $scope.userFirebaseObj.$watch(function() {
            setScope();
        })
    });

    //to return to state and see things
    if ($scope.user) {
        setScope();
        if ($rootScope.unwatchUser) $rootScope.unwatchUser();
        $rootScope.unwatchUser = $scope.userFirebaseObj.$watch(function() {
            setScope();
        });
    }

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
        Snippet.duplicateAsTemplate(snippetCopyId).then(function() {
            Materialize.toast('Snippet copied', 1250, 'toastCopied');
        }).catch(function() {
            Materialize.toast('Copy Failed', 2000, 'toastFail');
        })
    }

    $scope.exportToEmail = function() {
        Email.compose();
    }

    $scope.reportsExpanded = false;
    $scope.expandAllReports = function() {
        var reports = _.reduce($rootScope.user.snippets.asManager, function(acc, value, key) {
            acc.push({ id: key, date: value });
            return acc;
        }, []);
        Snippet.getSnippetPanelIds(reports, $scope.dateInRange, 'report').forEach(id => {
            $mdExpansionPanel(id).expand()
        });
        $scope.reportsExpanded = true;
    }
    $scope.collapseAllReports = function () {
        var reports = _.reduce($rootScope.user.snippets.asManager, function(acc, value, key) {
            acc.push({ id: key, date: value });
            return acc;
        }, []);
        Snippet.getSnippetPanelIds(reports, $scope.dateInRange, 'report').forEach(id => {
            $mdExpansionPanel(id).collapse()
        });
        $scope.reportsExpanded = false;
    }
    $scope.teamSnippetsExpanded = false;
    $scope.expandAllTeamSnippets = function() {
        Snippet.getSnippetPanelIds($scope.allSnippetIds, $scope.dateInRange, 'all').forEach(id => {
            $mdExpansionPanel(id).expand();
        });
        $scope.teamSnippetsExpanded = true;
    }
    $scope.collapseAllTeamSnippets = function() {
        Snippet.getSnippetPanelIds($scope.allSnippetIds, $scope.dateInRange, 'all').forEach(id => {
            $mdExpansionPanel(id).collapse();
        });
        $scope.teamSnippetsExpanded = false;
    }
});
