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

    return Snippet;

  });
