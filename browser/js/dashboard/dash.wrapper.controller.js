app.controller('DashWrapperCtrl', function($scope, $state, $mdDialog, MdHelpers) {

	$scope.currentWeekNum = parseInt($state.params.week);

	var d = new Date();
	d.setDate(d.getDate() - d.getDay() + ($scope.currentWeekNum * 7));

	$scope.currentWeek = d.valueOf();

	$scope.displayWeek = ($scope.currentWeekNum) ? "Week of " + d.toDateString() : "This Week";

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
