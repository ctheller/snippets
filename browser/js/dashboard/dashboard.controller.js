app.controller('DashboardCtrl', function($rootScope, $scope, $mdDialog, MdHelpers, Snippet) {
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
        {icon: 'people'}, {icon: 'person'}
    ];
    $scope.card = true;
    $scope.dragged = [];
    $scope.reportIds = [];
    $scope.teamSnippetIds = [];
    $scope.collabSnippetIds = [];

    // $scope.reportIds = Object.keys($rootScope.user.snippets.asManager);

    $rootScope.userRef.on('child_changed', function(){
        $scope.teamSnippetIds = Object.keys($rootScope.user.snippets.asTeamMember);
    })

    // $scope.collabSnippetIds = Object.keys($rootScope.user.snippets.asCollaborator);


    // Snippet.getReportSnippetIds(function (reportIds) {
    //     // snippet ids from reports
    //     $scope.reportIds = reportIds;
    //     $scope.$digest();
    // });
    // Snippet.getTeamSnippetIds(function (teamSnippetIds) {
    //     // snippet ids from reports
    //     $scope.teamSnippetIds = teamSnippetIds;
    //     $scope.$digest();
    // });
    // Snippet.getCollabSnippetIds(function (collabSnippetIds) {
    //     // snippet ids where Im a collaborator
    //     $scope.collabSnippetIds = collabSnippetIds;
    //     $scope.$digest();
    // })

    $scope.toggle = function() {
        $mdSidenav('right').toggle();
        if ($mdSidenav('right').isOpen()) $rootScope.$emit('open');
        else $rootScope.$emit('close');
    };


});
