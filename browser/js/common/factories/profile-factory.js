app.factory("Profile", ["$firebaseObject",
  function($firebaseObject) {
    return function(userId) {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref("users");
      var profileRef = ref.child(userId);

      // return it as a synchronized object
      return $firebaseObject(profileRef);
    }
  }
]);