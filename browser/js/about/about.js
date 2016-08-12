app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope, AuthService, AUTH_EVENTS, $rootScope, Snippet, $log, Users) {

    ///IF YOU GET INFO AS AN OBJECT, YOU CAN $BIND ON IT. IF IT'S AS AN ARRAY, YOU CAN ACCESS THE IDS BUT YOU CAN'T PERSIST CHANGES WITHOUT CALLING SAVE.

    var setSnippetBinding = function() {
    	Snippet.getSnippetById(Object.keys($scope.user.snippets)[0]).$bindTo($scope, 'snippet');
    };

    Users.getAll().$bindTo($scope, 'users');

    Snippet.getAllSnippetsAllowed().$bindTo($scope, 'allSnippets').then(function(){
        console.log($scope.allSnippets);
    })

    $scope.addCollaborators = function(idArray, snippetId){
        idArray.forEach(function(id){

            if (!$scope.users[id].snippets) {
                var obj = {};
                obj[snippetId] = true;
                $scope.users[id].snippets = obj;
            } 
            else $scope.users[id].snippets[snippetId] = true;

            $scope.allSnippets[snippetId].collaborators[id] = true;
        })
    }

    $scope.removeCollaborator = function(userId, snippetId){
        //prevent from removing self as collaborator
        if (userId === $scope.user.$id) return;
        $scope.users[userId].snippets[snippetId] = null;
        $scope.allSnippets[snippetId].collaborators[userId] = null;
    }



    var setUserBinding = function() {    
        $scope.user = AuthService.getLoggedInUser();
        if ($scope.user) Users.getProfile($scope.user.$id).$bindTo($scope, "user").then(function(){
        	setSnippetBinding();
        }).catch($log);
    };

    $scope.saveCollaborators = Snippet.saveCollaborators;

    $scope.create = Snippet.create;


    var removeUser = function() {
        $scope.user = null;
    };

    setUserBinding();

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUserBinding);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);

});