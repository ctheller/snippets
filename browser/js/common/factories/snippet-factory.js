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

    Snippet.getReportSnippetIds = function(callback) {
        var currentUser = AuthService.getLoggedInUser();
        ref.child("snippets").orderByChild("manager").equalTo(currentUser.$id)
            .once('value', function(snap) {
                callback(Object.keys(snap.val()));
            });
    };

    //TEAM SNIPPETS COME FROM WITHIN (but actually... all snippets should be added to an entire team upon creation)

    Snippet.create = function(data) {
        var currentUser = AuthService.getLoggedInUser();
        data.team = currentUser.manager;
        data.owner = currentUser.$id;
        data.submitted = false;
        var obj = {};
        obj[currentUser.$id] = true;
        data.collaborators = obj;
        var newSnippetKey = ref.child("snippets").push().key;

        Users.findUsersMatchingManager(currentUser.manager, function(result) {
            var updates = {};
            updates['/snippets/' + newSnippetKey] = data;

            result.forEach(function(userId) {
                updates['/users/' + userId + '/snippets/' + newSnippetKey] = true;
            });

            return ref.update(updates);
        });
    };

    Snippet.duplicateAsTemplate = function(snippetId) {
        var fromSnippet = Snippet.getSnippetById(snippetId);
        var dataToTransfer = { subject: fromSnippet.subject, content: fromSnippet.content };
        Snippet.create(dataToTransfer);
    };

    Snippet.delete = function(snippetId) {
        var snippet = $firebaseObject(ref.child("snippets").child(snippetId));
        var removeSnippetFromCollaborators = function (collaborators) {
            collaborators.forEach(collaborator => {
                collaborator = Users.getProfile(collaborator);
                return collaborator.$loaded().then(function() {
                    if (collaborator.snippets.hasOwnProperty(snippetId)) {
                        collaborator.snippets[snippetId] = null;
                        collaborator.$save();
                    }
                })
            });
        }
        snippet.$loaded().then(function() {
            var collaborators = _.keys(snippet.collaborators);
            Users.findUsersMatchingManager(snippet.team, function (members) {
                collaborators = _.union(members, collaborators);
                removeSnippetFromCollaborators(collaborators);
            })
            snippet.$remove();
        });
    };

    return Snippet;

});
