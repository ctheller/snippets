app.factory("Users", function($rootScope) {

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

       return ref.child(userId).once('value').then(function(snapshot){
            var user = snapshot.val();
            user.$id = userId;
            $rootScope.$evalAsync();
            return user;
        })
    }

    Users.removeAsCollaborator = function(userId, snippetId) {
        firebase.database().ref('users/'+ userId +"/snippets/asCollaborator/" + snippetId).set(null);
        firebase.database().ref('snippets/'+ snippetId +"/collaborators/" + userId).set(null);
    }

    Users.addAsCollaborator = function(userId, snippetId, snippetCreationTime) {
        firebase.database().ref('users/'+ userId +"/snippets/asCollaborator/" + snippetId).set(snippetCreationTime);
        firebase.database().ref('snippets/'+ snippetId +"/collaborators/" + userId).set(true);
    }

    return Users;

});
