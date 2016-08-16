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

    Users.removeAsCollaborator = function(userId, snippetId) {
        firebase.database().ref('users/'+ userId +"/snippets/asCollaborator/" + snippetId).set(null);
    }

    Users.addAsCollaborator = function(userId, snippetId) {
        firebase.database().ref('users/'+ userId +"/snippets/asCollaborator/" + snippetId).set(true);
    }

    Users.addAsManager = function(userId, snippetId) {
        firebase.database().ref('users/'+ userId +"/snippets/asManager/" + snippetId).set(true);
    }

    Users.removeAsManager = function(userId, snippetId) {
        firebase.database().ref('users/'+ userId +"/snippets/asManager/" + snippetId).set(null);
    }

    return Users;

});
