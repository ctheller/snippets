app.controller('DashWrapperCtrl', function($scope, $state, $mdDialog, MdHelpers) {

	$scope.currentWeekNum = parseInt($state.params.week);
    
    $scope.go = function(weekNum){
        $scope.loaded = false;
        $state.go('dashboard.week', {week: weekNum}, { reload: true });
    }

	var d = new Date();
	d.setDate(d.getDate() - d.getDay() + ($scope.currentWeekNum * 7));

	$scope.currentWeek = d.valueOf();

	$scope.displayWeek = ($scope.currentWeekNum) ? "Week of " + d.toDateString() : "This Week";

    $scope.loaded = true;

    $scope.showSnippetForm = function(ev) {
        $mdDialog.show({
            controller: MdHelpers.dialogCtrl,
            templateUrl: 'js/dashboard/new-snippet-form.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

});
