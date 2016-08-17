app.factory("Organizations", function($firebaseObject, $firebaseArray, $rootScope) {

    var Organizations = {};

    // Check the organization table for logged in user's org, then iterate through and find all users in org. Add them to rootscope.
    Organizations.get = function() {
        var orgRef = firebase.database().ref("organizations").child($rootScope.user.organization);
        return $firebaseObject(orgRef);
    };


    return Organizations;

})