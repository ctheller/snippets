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

    $scope.searchParams = {};

    $scope.sendSearchQuery = function() {
        Search.sendSearchQuery($scope.searchParams)
        // doSearch(makeTerm($scope.searchParams));
    }

    // var PATH = 'search';
    // var database = firebase.database();

    // function doSearch(query) {
    //     var index = 'firebase';
    //     var ref = database.ref().child(PATH);
    //     var type = 'snippet';
    //     var key = ref.child('request').push({ index: index, type: type, query: query }).key;
    //     ref.child('response/' + key).on('value', sendResults);
    // }

    // function sendResults(snap) {
    //     if (!snap.exists()) {
    //         return;
    //     } // wait until we get data
    //     var data = snap.val();
    //     var result = { 'data': data };
    //     $state.go('search', { 'result': result });
    // }



    // function makeTerm(params) {
    //     var keys = Object.keys(params);
    //     var searching = [];
    //     var term;
    //     for (var key in params) {
    //         term = params[key]
    //         if (!term.match(/^\*/)) { term = '*' + term; }
    //         if (!term.match(/\*$/)) { term += '*'; }
    //         var queryStr = (key !== 'query') ? ('' + key + ':' + term) : (term)

    //         searching.push(queryStr);
    //     }
    //     return searching.join(' AND ');
    // }

});
