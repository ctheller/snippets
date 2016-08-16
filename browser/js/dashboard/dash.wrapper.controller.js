app.controller('DashWrapperCtrl', function($scope, $state) {

	$scope.currentWeekNum = parseInt($state.params.week);

	var d = new Date();
	d.setDate(d.getDate() - d.getDay() + ($scope.currentWeekNum * 7));

	$scope.displayWeek = "Week of " + d.toDateString();

	if ($scope.currentWeekNum === 0) $scope.displayWeek = "This Week";

	console.log($scope.currentWeekNum);

});