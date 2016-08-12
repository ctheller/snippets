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

    Snippet.delete = function(snippetId){
    	ref.child(snippetId).remove();
    	//Also remove from users' lists of snippets
    }

    return Snippet;

  });


//MAYBE snippets don't have to live on users. It'll just return the ones for which they are explicitly granted permission?