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
    $scope.activePanel = 'all';
    $scope.teamSnippetsExpanded = false;
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
    $scope.collapseAllReports = function() {
        var reports = _.reduce($rootScope.user.snippets.asManager, function(acc, value, key) {
            acc.push({ id: key, date: value });
            return acc;
        }, []);
        Snippet.getSnippetPanelIds(reports, $scope.dateInRange, 'report').forEach(id => {
            $mdExpansionPanel(id).collapse()
        });
        $scope.reportsExpanded = false;
    }
    $scope.expandAllTeamSnippets = function(activePanel) {
        Snippet.getSnippetPanelIds(getArrayOfSnippets(activePanel), $scope.dateInRange, activePanel).forEach(id => {
            $mdExpansionPanel(id).expand();
        });
        $scope.teamSnippetsExpanded = true;
    }
    $scope.collapseAllTeamSnippets = function(activePanel) {
        Snippet.getSnippetPanelIds(getArrayOfSnippets(activePanel), $scope.dateInRange, activePanel).forEach(id => {
            $mdExpansionPanel(id).collapse();
        });
        $scope.teamSnippetsExpanded = false;
    }

    // report, team, split
    $scope.expandedView = 'split';
    $scope.expandView = function(view) {
        $scope.expandedView = view;
    }
    $scope.collapseView = function () {
        $scope.expandedView = 'split';
    }

    var getArrayOfSnippets = function(type) {
        if (type === 'all') {
            var snippetIds = _.cloneDeep($scope.allSnippetIds);
            return snippetIds.map(obj => {
                obj.type = 'all'
                return obj;
            });
        } else if (type === 'mine') {
            return _.reduce($rootScope.user.snippets.asOwner, function(acc, value, key) {
                acc.push({ id: key, date: value });
                return acc;
            }, []);
        } else if (type === 'team') {
            return _.reduce($rootScope.user.snippets.asTeamMember, function(acc, value, key) {
                acc.push({ id: key, date: value });
                return acc;
            }, []);
        } else if (type === 'collab') {
            return _.reduce($rootScope.user.snippets.asCollaborator, function(acc, value, key) {
                acc.push({ id: key, date: value });
                return acc;
            }, []);
        }
    }
});
