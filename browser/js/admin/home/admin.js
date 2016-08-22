app.controller('adminCtrl', function(Users, $rootScope) {
    var Users = {};
    var Snippets = {};

    // create a reference to the database node where we will store our data
    var ref_users = firebase.database().ref("users");

});

app.controller('TabController', function() {
    this.tab = 'Users';

    this.select = function(tabId) {
        this.tab = tabId;
    };

    this.selected = function(tabId) {
        return this.tab === tabId;
    };

});
