app.controller('ToolbarCtrl', function($scope, $mdSidenav, Auth, $rootScope, $state, Search) {

    $scope.sidebarOpen = "false";

    function DialogController($scope, $mdDialog) {
        $scope.closeDialog = function() {
            $mdDialog.hide();
        };
    };

    function ProfileCtrl($scope, $mdDialog, Auth, Users) {
        $scope.hide = function() {
            $mdDialog.hide();
        };

        // clicking save closes the dialog
        $scope.saveProfile = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        // fetches the user's unique id to look up the user profile
        var uid = Auth.$getAuth().uid;

        // updates the profile in the DB using 3-way binding
        Users.getProfile(uid).$bindTo($scope, "user");

    };

    $scope.toggle = function() {
        $mdSidenav('left').toggle();
        if ($mdSidenav('left').isOpen()) $rootScope.$emit('open');
        else $rootScope.$emit('close');
    };

    $scope.logout = function() {
        Auth.$signOut();
        $state.go('home');
    };

    $scope.availableSearchParams = [
        { key: "subject", name: "subject", placeholder: "subject:", allowMultiple: true },
        { key: "contents", name: "contains", placeholder: "contains:", allowMultiple: true }
    ];

    $rootScope.$on('clearNgModel', function() {
        $scope.searchParams = {};
    })
    $scope.sendSearchQuery = function() {
        console.log($scope.searchParams)
        if (!_.isEmpty($scope.searchParams)) {
            Search.sendSearchQuery(newValue)
        }

    }
});
