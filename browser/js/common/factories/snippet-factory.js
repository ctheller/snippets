app.factory("Snippet", function($firebaseObject) {

  	var Snippet = {};

  	var ref = firebase.database().ref("snippets");

    Snippet.getSnippetById = function(snippetId) {
      // create a reference to the database node where we will store our data
      var profileRef = ref.child(snippetId);
      // return it as a synchronized object
      return $firebaseObject(profileRef);
    }

    Snippet.getAllSnippetsAllowed = function() {
    	return $firebaseObject(ref);
    }

    Snippet.create = function(data){
    	var newRef = ref.push();
    	newRef.set(data, function(){
    		//Add newRef.$uid to list of current User's Snippets
    		//Figure out how to learn it's timestamp
    		console.log(newRef);
    	})
    }

    Snippet.addCollaborator = function(userId){
    	//Add userId to this snippit's list of "users"
    	//find the user and add it to their "snippet" children
    }

    Snippet.removeCollaborator = function(userId){
    	//Remove userId from this snippit's list of "users"
    	//find the user and remove it from their "snippet" children
    }

    Snippet.delete = function(snippetId){
    	ref.child(snippetId).remove();
    	//Also remove from users' lists of snippets by iterating through "collaborators" and deleting it off them first.
    }

    return Snippet;

  });
