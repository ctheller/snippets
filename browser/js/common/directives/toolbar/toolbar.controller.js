app.controller('ToolbarCtrl', function($scope, $mdSidenav, Auth, $rootScope, $state, Search, $mdDialog, MdHelpers) {

    $rootScope.$state = $state;


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
        console.log($state.is('graphing'))
        $mdSidenav('left').toggle();
        if ($mdSidenav('left').isOpen()) $rootScope.$emit('open');
        else $rootScope.$emit('close');
    };

    $scope.logout = function() {
        Auth.$signOut();
        $state.go('home');
    };

    $scope.searchFor = 'snippet';

    $scope.userSearchParams = Search.userSearchParams

    $scope.snippetSearchParams = Search.snippetSearchParams

    $scope.availableSearchParams = $scope.snippetSearchParams;

    $scope.setSearchParams = function (option) {
        if (option === 'colleague') {
            $scope.availableSearchParams = $scope.userSearchParams;
            $scope.searchFor = 'user';
        } else if (option === 'snippet') {
            $scope.availableSearchParams = $scope.snippetSearchParams;
            $scope.searchFor = 'snippet';
        }
    }

    $rootScope.$on('clearNgModel', function () {
        $scope.searchParams = {};
    });

    $scope.searchParams = {};

    $scope.sendSearchQuery = function() {
        if (!_.isEmpty($scope.searchParams)) {
            $scope.$watchCollection('searchParams', function(newVal, oldVal, scope) {
                Search.sendSearchQuery(scope.searchFor, scope.searchParams, window.location.href)
            }, true)
        }
    }

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
