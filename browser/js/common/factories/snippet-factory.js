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

    Snippet.create = function(data){
    	var currentUser = AuthService.getLoggedInUser();
    	data.team = currentUser.manager;
    	data.owner = currentUser.$id;
    	data.submitted = false;
    	var obj = {};
    	obj[currentUser.$id] = true;
    	data.collaborators = obj;
    	var newSnippetKey = ref.child("snippets").push().key;


		Users.findUsersMatchingManager(currentUser.manager, function(result){
			var updates = {};
			updates['/snippets/' + newSnippetKey] = data;

			result.forEach(function(userId){
				updates['/users/' + userId + '/snippets/' + newSnippetKey] = true;
			});

			return ref.update(updates);
		});
    };

    Snippet.duplicateAsTemplate = function(snippetId) {
    	var fromSnippet = Snippet.getSnippetById(snippetId);
    	var dataToTransfer = {subject: fromSnippet.subject, content: fromSnippet.content};
    	Snippet.create(dataToTransfer);
    };

    Snippet.delete = function(snippetId){
    	ref.child(snippetId).remove();
    	//Also remove from users' lists of snippets by iterating through "collaborators" and deleting it off them first.
    };

    return Snippet;

  });
