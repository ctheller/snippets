app.controller('ToolbarCtrl', function($scope, $mdSidenav, Auth, $rootScope, $state) {

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
        { key: "owner", name: "Name", placeholder: "Name:", allowMultiple: true },
        { key: "contents", name: "content", placeholder: "contains:", allowMultiple: true }
    ];

    $scope.searchParams = {};
    $scope.sendSearchQuery = function() {
        var key = Object.keys($scope.searchParams)[0]
        doSearch(key, makeTerm($scope.searchParams[key]))
    }

    var PATH = 'search';
    var database = firebase.database();

    function doSearch(type, query) {
        var index = 'firebase';
        var ref = database.ref().child(PATH);
        var key = ref.child('request').push({ index: index, type: type, query: query }).key;
        ref.child('response/' + key).on('value', showResults);
    }

    function showResults(snap) {
        if (!snap.exists()) {
            return; } // wait until we get data
        var data = snap.val();
        console.log(data, 'elastic search is awesome');
        $state.go('search');
    }

    function makeTerm(term) {
        if (!term.match(/^\*/)) { term = '*' + term; }
        if (!term.match(/\*$/)) { term += '*'; }
        return term;
    }
});
