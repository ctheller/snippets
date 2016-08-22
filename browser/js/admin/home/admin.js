app.controller('adminCtrl', function(Users, $rootScope) {
    var Users = {};
    var Snippets = {};

    // create a reference to the database node where we will store our data
    var ref_users = firebase.database().ref("users");

    console.log('scope users', $rootScope.users);

});
