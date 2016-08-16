app.controller('DashWrapperCtrl', function($scope, $state) {

	$scope.currentWeek = parseInt($state.params.week);

	console.log($scope.currentWeek);

});