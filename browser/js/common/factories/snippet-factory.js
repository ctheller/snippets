app.factory("Snippet", ["$firebaseObject",
  function($firebaseObject) {
    return function(snippetId) {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref("snippets");
      var profileRef = ref.child(snippetId);
      // return it as a synchronized object
      return $firebaseObject(profileRef);
    }
  }
]);