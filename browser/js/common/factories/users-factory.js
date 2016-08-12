app.factory("Users", function($firebaseObject) {
    return function() {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref("users");
      // return it as a synchronized array
      return $firebaseObject(ref);
    }
});