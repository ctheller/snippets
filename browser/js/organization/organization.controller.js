app.controller('OrgController', function ($scope,Users, AuthService, AUTH_EVENTS, $rootScope, $log, orgJson) {

    $scope.availableSearchParams = [
        { key: "name", name: "Name", placeholder: "Name..." },
        { key: "city", name: "City", placeholder: "City..." },
        { key: "country", name: "Country", placeholder: "Country..." },
        { key: "emailAddress", name: "E-Mail", placeholder: "E-Mail...", allowMultiple: true },
        { key: "job", name: "Job", placeholder: "Job..." }
    ];

    $scope.orgJson = orgJson;

});
