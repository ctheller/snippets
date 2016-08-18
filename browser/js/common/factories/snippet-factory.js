app.factory("Snippet", function($firebaseObject, AuthService, Users, $rootScope) {

    var Snippet = {};

    var ref = firebase.database().ref();

    Snippet.getSnippetById = function(snippetId) {
        // create a reference to the database node where we will store our data
        var snippetRef = ref.child("snippets").child(snippetId);
        // return it as a synchronized object
        return $firebaseObject(snippetRef);
    };

    Snippet.getAllSnippetsAllowed = function() {
        return $firebaseObject(ref.child("snippets"));
    };

    // FIREBASE WARNING: Using an unspecified index. Consider adding ".indexOn": "team" at /snippets to your security rules for better performance
    // able to do this kind of filtering at backend???

    Snippet.getReportSnippetIds = function(callback) {
        var currentUser = AuthService.getLoggedInUser();
        ref.child("snippets").orderByChild("team").equalTo(currentUser.$id)
            .once('value', function(snap) {
                callback(Object.keys(snap.val()));
            });
    };

    Snippet.getTeamSnippetIds = function(callback) {
        var currentUser = AuthService.getLoggedInUser();
        ref.child("snippets").orderByChild("team").equalTo(currentUser.manager)
            .once('value', function(snap) {
                callback(Object.keys(snap.val()));
            });
    }

    Snippet.getCollabSnippetIds = function(callback) {
        var currentUser = AuthService.getLoggedInUser();
        ref.child("snippets").orderByChild("collaborators/" + currentUser.$id)
            .once('value', function(snap) {
                callback(Object.keys(snap.val()));
            });
    }

    Snippet.submit = function(snippetId, managerId){
        console.log('submitting', snippetId, managerId);
        var updates = {};
        updates['/snippets/' + snippetId +"/submitted"] = true;
        updates[`/users/${managerId}/snippets/asManager/${snippetId}`] = Date.now();
        return ref.update(updates);
    }

    Snippet.unsubmit = function(snippetId, managerId){
        var updates = {};
        updates['/snippets/' + snippetId +"/submitted"] = false;
        updates[`/users/${managerId}/snippets/asManager/${snippetId}`] = null;
        return ref.update(updates);
    }

    //TEAM SNIPPETS COME FROM WITHIN (but actually... all snippets should be added to an entire team upon creation)

    Snippet.create = function(data) {
        var currentUser = AuthService.getLoggedInUser();
        data.team = currentUser.manager;
        data.owner = currentUser.$id;
        data.dateAdded = Date.now();
        data.submitted = false;
        var obj = {};
        obj[currentUser.$id] = true;
        data.collaborators = obj;
        var newSnippetKey = ref.child("snippets").push().key;
        var teammateIds = Users.findUsersMatchingManager(currentUser.manager);
        var updates = {};
        updates['/snippets/' + newSnippetKey] = data;
        updates[`/users/${currentUser.$id}/snippets/asOwner/${newSnippetKey}`] = data.dateAdded;

        teammateIds.forEach(function(userId) {
            updates[`/users/${userId}/snippets/asTeamMember/${newSnippetKey}`] = data.dateAdded;
        });

        return ref.update(updates);

        //handle error (return something) return something from create!!
    };

    Snippet.duplicateAsTemplate = function(snippetId) {
        console.log(snippetId);
        var fromSnippet = Snippet.getSnippetById(snippetId);
        fromSnippet.$loaded().then(function() {
            var dataToTransfer = { subject: fromSnippet.subject, contents: fromSnippet.contents };
            Snippet.create(dataToTransfer);
        })

    };


    //return statement on 82 not doing anything. Think about returns in general!
    // Snippet.delete = function(snippetId) {
    //     var snippet = $firebaseObject(ref.child("snippets").child(snippetId));
    //     var removeSnippetFromCollaborators = function(collaborators) {
    //         collaborators.forEach(collaborator => {
    //             collaborator = Users.getProfile(collaborator);
    //             return collaborator.$loaded().then(function() {
    //                 if (collaborator.snippets.asTeamMember.hasOwnProperty(snippetId)) {
    //                     collaborator.snippets.asTeamMember[snippetId] = null;
    //                     collaborator.$save();
    //                 }
    //                 if (collaborator.snippets.asCollaborator.hasOwnProperty(snippetId)) {
    //                     collaborator.snippets.asCollaborator[snippetId] = null;
    //                     collaborator.$save();
    //                 }
    //             })
    //         });
    //     }
    //     snippet.$loaded().then(function() {
    //         var collaborators = _.keys(snippet.collaborators);
    //         Users.findUsersMatchingManager(snippet.team, function(members) {
    //             collaborators = _.union(members, collaborators);
    //             removeSnippetFromCollaborators(collaborators);
    //         });
    //         snippet.$remove();
    //     });
    // };

    Snippet.delete = function(snippetId) {
        var snippet = $firebaseObject(ref.child("snippets").child(snippetId));
        return snippet.$loaded().then(function(){
            var updates = {};
            var collaborators = _.keys(snippet.collaborators);
            collaborators.forEach(function(collab){
                updates[`/users/${collab}/snippets/asTeamMember/${snippetId}`] = null;
                updates[`/users/${collab}/snippets/asCollaborator/${snippetId}`] = null;
                updates[`/users/${collab}/snippets/asManager/${snippetId}`] = null;
            })
            updates[`/users/${snippet.team}/snippets/asManager/${snippetId}`] = null;
            updates[`/users/${snippet.owner}/snippets/asOwner/${snippetId}`] = null;
            updates['/snippets/' + snippetId] = null;
            return ref.update(updates);
        })
    }

    return Snippet;

});
