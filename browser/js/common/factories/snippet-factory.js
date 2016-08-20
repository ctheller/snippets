app.factory("Snippet", function($firebaseObject, AuthService, Users) {

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
        var fromSnippet = Snippet.getSnippetById(snippetId);
        return fromSnippet.$loaded().then(function() {
            var dataToTransfer = { subject: fromSnippet.subject, contents: fromSnippet.contents };
            return Snippet.create(dataToTransfer);
        })

    };


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
            updates[`/users/${snippet.owner}/snippets/asCollaborator/${snippetId}`] = null;
            updates[`/users/${snippet.owner}/snippets/asTeamMember/${snippetId}`] = null;
            updates['/snippets/' + snippetId] = null;
            return ref.update(updates);
        })
    }



    Snippet.getSnippetIdsWithInfo = function(user){
        if (!user || !user.snippets) return [];

        var ownedSnippetIds = user.snippets.asOwner ? user.snippets.asOwner : {};
        var mappedOwnedIds = [];
        _.forEach(ownedSnippetIds, function(value, key){
            mappedOwnedIds.push({id: key, date: value, type: 'mine'});
        })

        var teamSnippetIds = user.snippets.asTeamMember ? user.snippets.asTeamMember : {};
        var mappedTeamIds = [];
        _.forEach(teamSnippetIds, function(value, key){
            mappedTeamIds.push({id: key, date: value, type: 'team'});
        })

        var collabSnippetIds = user.snippets.asCollaborator ? user.snippets.asCollaborator : {};
        var mappedCollabIds = [];
        _.forEach(collabSnippetIds, function(value, key){
            mappedCollabIds.push({id: key, date: value, type: 'collab'});
        })

        return _.unionBy(mappedOwnedIds, _.unionBy(mappedCollabIds, mappedTeamIds, 'id'), 'id');



    }

    Snippet.getSnippetPanelIds = function (snippetArr, filterFn, type) {
        var snippetsInView = snippetArr.filter(obj => {
            return filterFn(obj.date)
        });
        return snippetsInView.map(obj => {
            return obj['id'] + type;
        });
    }

    return Snippet;

});
