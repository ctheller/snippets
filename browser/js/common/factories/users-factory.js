app.factory("Users", function($firebaseObject, $firebaseArray, $rootScope) {

    var Users = {};

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");

    Users.findUsersMatchingManager = function(managerId) {
        
        var teammates = $rootScope.users.filter(user => user.manager === managerId);
        return teammates.map(teammate => teammate.$id);
    };

    Users.getUsers = function(userIdArray){
        var gettingUsers =  userIdArray.map(function(id){
            if (!id) return;
            return Users.getById(id);
        });
        return Promise.all(gettingUsers);

    }

    Users.getById = function(userId){
        if (!userId) return;
        var thisUser = $firebaseObject(ref.child(userId));
        return thisUser.$loaded().then(function(){
            return thisUser;
        })
    }

    Users.getProfile = function(userId) {
        if (!userId) return;
        var profileRef = ref.child(userId);
        // return it as a synchronized object
        return $firebaseObject(profileRef);
    };

    Users.removeAsCollaborator = function(userId, snippetId) {
        firebase.database().ref('users/'+ userId +"/snippets/asCollaborator/" + snippetId).set(null);
    }

    Users.addAsCollaborator = function(userId, snippetId, snippetCreationTime) {
        firebase.database().ref('users/'+ userId +"/snippets/asCollaborator/" + snippetId).set(snippetCreationTime);
    }

    return Users;

});
