app.controller('DashboardCtrl', function($rootScope, $scope, $mdDialog, MdHelpers, AUTH_EVENTS, Snippet) {


    var dateFilter = function(obj){
        return _.pickBy(obj, function(snippetCreated){
            var diff = (snippetCreated - $scope.currentWeek)/(1000*60*60*24);
            return (diff < 7 && diff > 0);
        })
    }

    var setScope = function(){
        if (!$rootScope.user.snippets) {
            $scope.teamSnippetIds = $scope.collabSnippetIds = $scope.collabAndTeamSnippetIds = $scope.reportSnippetIds = [];
            return;
        }
        $scope.teamSnippetIds = $rootScope.user.snippets.asTeamMember ? Object.keys(dateFilter($rootScope.user.snippets.asTeamMember)) : [];
        $scope.collabSnippetIds = $rootScope.user.snippets.asCollaborator ? Object.keys(dateFilter($rootScope.user.snippets.asCollaborator)) : [];
        $scope.reportSnippetIds = $rootScope.user.snippets.asManager ? Object.keys(dateFilter($rootScope.user.snippets.asManager)) : [];
        console.log($scope.teamSnippetIds);
        console.log($rootScope.user)
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

    $scope.draggables = [
        { icon: 'people' }, { icon: 'person' }
    ];

    $scope.createNewSnippet = function(e, ui) {
        var snippetCopyId = ui.draggable.scope().id;
        Snippet.duplicateAsTemplate(snippetCopyId);
    }

});
