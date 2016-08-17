app.factory("Users", function($firebaseObject, $firebaseArray, $rootScope) {

    var Users = {};

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");

    Users.findUsersMatchingManager = function(managerId, callback) {
        ref.orderByChild('manager').equalTo(managerId).once('value', function(snap) {
            callback(Object.keys(snap.val()));
        });
    };

    Users.getUsers = function(userIdArray){
        var gettingUsers =  userIdArray.map(function(id){
            return Users.getById(id);
        });
        return Promise.all(gettingUsers);

    }

    Users.getById = function(userId){
        var thisUser = $firebaseObject(ref.child(userId));
        return thisUser.$loaded().then(function(){
            return thisUser;
        })
    }

    Users.getProfile = function(userId) {
        var profileRef = ref.child(userId);
        // return it as a synchronized object
        return $firebaseObject(profileRef);
    };

    Users.removeAsCollaborator = function(userId, snippetId) {
        firebase.database().ref('users/'+ userId +"/snippets/asCollaborator/" + snippetId).set(null);
    }

    Users.addAsCollaborator = function(userId, snippetId, snippetCreationTime) {
        console.log(snippetCreationTime);
        firebase.database().ref('users/'+ userId +"/snippets/asCollaborator/" + snippetId).set(snippetCreationTime);
    }

    // Users.addAsManager = function(userId, snippetId) {
    //     firebase.database().ref('users/'+ userId +"/snippets/asManager/" + snippetId).set(true);
    // }

    // Users.removeAsManager = function(userId, snippetId) {
    //     firebase.database().ref('users/'+ userId +"/snippets/asManager/" + snippetId).set(null);
    // }

    return Users;

});
