app.controller('DashboardCtrl', function($rootScope, $scope, $mdDialog, MdHelpers, AUTH_EVENTS, Snippet) {

    var setScope = function(){
        if (!$rootScope.user.snippets) {
            $scope.teamSnippetIds = $scope.collabSnippetIds = $scope.collabAndTeamSnippetIds = $scope.reportSnippetIds = [];
            return;
        }
        $scope.teamSnippetIds = $rootScope.user.snippets.asTeamMember ? Object.keys($rootScope.user.snippets.asTeamMember) : [];
        $scope.collabSnippetIds = $rootScope.user.snippets.asCollaborator ? Object.keys($rootScope.user.snippets.asCollaborator) : [];
        $scope.reportSnippetIds = $rootScope.user.snippets.asManager ? Object.keys($rootScope.user.snippets.asManager) : [];
        $scope.teamSnippetIds = $scope.teamSnippetIds.map(id => {
            var obj = {};
            obj.id = id;
            obj.type = 'team'
            return obj;
        });
        $scope.collabSnippetIds = $scope.collabSnippetIds.map(id => {
            var obj = {};
            obj.id = id;
            obj.type = 'collab';
            return obj;
        });
        $scope.collabAndTeamSnippetIds = _.unionBy($scope.collabSnippetIds, $scope.teamSnippetIds, 'id');
        $scope.isManager = false;
        if ($rootScope.user['reports']) {
            $scope.isManager = true;
        }
    }

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
        setScope();
        $rootScope.userFirebaseObj.$watch(function() {
            setScope();
        })
    });

    if ($scope.user) {
        setScope();
        $rootScope.userFirebaseObj.$watch(function() {
            setScope();
        })
    }

    $scope.card = true;
    $scope.dragged = [];

    $scope.toggle = function() {
        $mdSidenav('right').toggle();
        if ($mdSidenav('right').isOpen()) $rootScope.$emit('open');
        else $rootScope.$emit('close');
    };

    $scope.newSnippet = {};

    $scope.showSnippetForm = function(ev) {
        $mdDialog.show({
            controller: MdHelpers.dialogCtrl,
            templateUrl: 'js/dashboard/new-snippet-form.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    $scope.draggables = [
        { icon: 'people' }, { icon: 'person' }
    ];

    $scope.createNewSnippet = function(e, ui) {
        var snippetCopyId = ui.draggable.scope().id;
        Snippet.duplicateAsTemplate(snippetCopyId);
    }

});
