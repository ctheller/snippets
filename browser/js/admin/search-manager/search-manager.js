app.controller('ManagerCtrl', ManagerCtrl);

function ManagerCtrl($mdDialog, $scope) {
    var self = this;

    //snippet is on this scope

    self.openDialog = function($event) {
        $mdDialog.show({
            controller: ManagerDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'js/admin/search-manager/search-manager.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            //see if I can just change this line below to scope
            scope: $scope
        })
    }
}



function ManagerDialogCtrl($timeout, $q, $scope, $mdDialog, $rootScope, Users) {

    var self = this;

    //need better way to access the parent scope here

    // list of `employee` value/display objects
    self.employees = loadAll();
    self.querySearch = querySearch;

    // ******************************
    // Template methods
    // ******************************

    self.cancel = function($event) {
        $mdDialog.cancel();
    };

    self.finish = function($event, selectedUserId) {

        if (!selectedUserId) return;

        if ($scope.userCopy.manager === selectedUserId) return $mdDialog.hide();

        Users.addAsManager($scope.userCopy.$id, selectedUserId);

        Users.getById(selectedUserId).then(function(manager) {
            var manager_name = manager.first_name + " " + manager.last_name;
            $scope.userCopy.manager_name = manager_name;
        })

        $mdDialog.hide();
    };

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for employees... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
        return query ? $q.when(self.employees.filter(createFilterFor(query))) : $q.when(self.employees);
    }

    /**
     * Build `employees` list of key/value pairs
     */
    function loadAll() {

        var allEmployees = [];

        $rootScope.users.forEach(function(user) {
            allEmployees.push({
                value: (user.first_name + " " + user.last_name).toLowerCase(),
                display: (user.first_name + " " + user.last_name),
                id: user.$id,
                photoUrl: user.photoUrl,
                lastName: user.last_name.toLowerCase()
            })
        })

        allEmployees.sort(function(a, b) {
            return (a.lastName < b.lastName) ? -1 : 1;
        })

        return allEmployees;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(employee) {
            return (employee.value.indexOf(lowercaseQuery) !== -1);
        };

    }
}
