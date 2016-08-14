app.factory("Users", function($firebaseObject, $firebaseArray) {

    var Users = {};

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");

    // return it as a synchronized object (array?)
    Users.getAll = function() {
        return $firebaseObject(ref);
    };

    Users.findUsersMatchingManager = function(managerId, callback) {
        ref.orderByChild('manager').equalTo(managerId).once('value', function(snap) {
            callback(Object.keys(snap.val()));
        });
    };

    Users.getProfile = function(userId) {
        var profileRef = ref.child(userId);
        // return it as a synchronized object
        return $firebaseObject(profileRef);
    };

    return Users;

});
