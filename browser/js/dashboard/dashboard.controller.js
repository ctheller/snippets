app.controller('DashboardCtrl', function($rootScope, $scope, $mdDialog, MdHelpers, AUTH_EVENTS, Snippet) {


    var dateFilter = function(obj){
        return _.pickBy(obj, function(snippetCreated){
            var diff = (snippetCreated - $scope.currentWeek)/(1000*60*60*24);
            return (diff < 7 && diff > 0);
        })
    }

    var setScope = function(){
        if (!$rootScope.user.snippets) {
            $scope.teamSnippetIds = $scope.collabSnippetIds = $scope.collabAndTeamSnippetIds = $scope.reportSnippetIds = $scope.mySnippetIds = $scope.allSnippetIds = [];
            return;
        }
        $scope.mySnippetIds = $rootScope.user.snippets.asOwner ? Object.keys(dateFilter($rootScope.user.snippets.asOwner)) : [];
        $scope.teamSnippetIds = $rootScope.user.snippets.asTeamMember ? Object.keys(dateFilter($rootScope.user.snippets.asTeamMember)) : [];
        $scope.collabSnippetIds = $rootScope.user.snippets.asCollaborator ? Object.keys(dateFilter($rootScope.user.snippets.asCollaborator)) : [];
        $scope.reportSnippetIds = $rootScope.user.snippets.asManager ? Object.keys(dateFilter($rootScope.user.snippets.asManager)) : [];
        $scope.mySnippetIds = $scope.mySnippetIds.map(function(id) {return {id: id, type: 'mine'}});
        $scope.teamSnippetIds = $scope.teamSnippetIds.map(function(id) {return {id: id, type: 'team'}});
        $scope.collabSnippetIds = $scope.collabSnippetIds.map(function(id) {return {id: id, type: 'collab'}});
        $scope.reportSnippetIds = $scope.reportSnippetIds.map(function(id) {return {id: id, type: 'report'}});
        $scope.collabAndTeamSnippetIds = _.unionBy($scope.collabSnippetIds, $scope.teamSnippetIds, 'id');
        $scope.allSnippetIds = _.unionBy($scope.mySnippetIds, $scope.collabAndTeamSnippetIds, 'id');
        $scope.isManager = false;
        if ($rootScope.user['reports']) {
            $scope.isManager = true;
        }

        // //FOR DEVELOPMENT ONLY::
        // $scope.reportSnippetIds = ["-KPPZT29sYqvv14KI5hJ", "GaT704CdvvMKxcj", "gqPHWiBGQu3kgRX"];
        // $scope.reportSnippetIds = $scope.reportSnippetIds.map(function(id) {return {id: id, type: 'report'}});
    }


    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
        setScope();
        $rootScope.userFirebaseObj.$watch(function() {
            setScope();
        })
    });

    if ($scope.user) {
        setScope();
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
