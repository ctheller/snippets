app.controller('OrgController', function ($scope,Users, AuthService, AUTH_EVENTS, $rootScope, $log, orgJson) {

    $scope.availableSearchParams = [
        { key: "name", name: "Name", placeholder: "Name..." },
        { key: "city", name: "City", placeholder: "City..." },
        { key: "country", name: "Country", placeholder: "Country..." },
        { key: "emailAddress", name: "E-Mail", placeholder: "E-Mail...", allowMultiple: true },
        { key: "job", name: "Job", placeholder: "Job..." }
    ];


    var setUserBinding = function() {
        $scope.user = AuthService.getLoggedInUser();
        if ($scope.user) Users.getProfile($scope.user.$id).$bindTo($scope, "user").then(function(){
            $scope.snippetIds = Object.keys($scope.user.snippets || {});
        }).catch($log);
    };

    setUserBinding();
    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUserBinding);
    $scope.orgJson = orgJson;

});
