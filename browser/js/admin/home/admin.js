app.controller('adminCtrl', function($scope, Users, $rootScope, $firebaseObject) {
    var Users = {};
    var Snippets = {};
    $scope.day = {};

    // create a reference to the database node where we will store our data
    var ref_users = firebase.database().ref("users");
    var ref_org = firebase.database().ref("organizations").child($rootScope.user.organization);
    $firebaseObject(ref_org).$loaded().then(function(){
        $scope.day.number = $scope.organization.dueDay.day;
        $scope.day.hour = $scope.organization.dueDay.time;
    });


    $scope.updateDueDate = function(){

    }

});

app.controller('TabController', function() {
    this.tab = 'Users';

    this.select = function(tabId) {
        this.tab = tabId;
    };

    this.selected = function(tabId) {
        return this.tab === tabId;
    };

})
