app.factory("Snippet", function($firebaseObject, AuthService, Users) {

  	var Snippet = {};

  	var ref = firebase.database().ref();

    Snippet.getSnippetById = function(snippetId) {
      // create a reference to the database node where we will store our data
      var snippetRef = ref.child("snippets").child(snippetId);
      // return it as a synchronized object
      return $firebaseObject(snippetRef);
    }

    Snippet.getAllSnippetsAllowed = function() {
    	return $firebaseObject(ref.child("snippets"));
    }

    Snippet.create = function(data){
    	var currentUser = AuthService.getLoggedInUser()
    	data.team = currentUser.manager;
    	data.owner = currentUser.$id;
    	var newSnippetKey = ref.child("snippets").push().key;

    	var updates = {};
		updates['/snippets/' + newSnippetKey] = data;
		updates['/users/' + currentUser.$id + '/snippets/' + newSnippetKey] = true;

		return ref.update(updates);
    };

    Snippet.addCollaborator = function(userId){
    	//Add userId to this snippit's list of "users"
    	//find the user and add it to their "snippet" children
    };

    Snippet.removeCollaborator = function(userId){
    	//Remove userId from this snippit's list of "users"
    	//find the user and remove it from their "snippet" children
    };

    Snippet.delete = function(snippetId){
    	ref.child(snippetId).remove();
    	//Also remove from users' lists of snippets by iterating through "collaborators" and deleting it off them first.
    };

    return Snippet;

  });
