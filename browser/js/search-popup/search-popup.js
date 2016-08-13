app.controller('PopupCtrl', PopupCtrl);

function PopupCtrl($mdDialog) {
  var self = this;

  self.openDialog = function($event) {
    $mdDialog.show({
      controller: DialogCtrl,
      controllerAs: 'ctrl',
      templateUrl: 'js/search-popup/search-popup.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true
    })
  }
}

function DialogCtrl ($timeout, $q, $scope, $mdDialog) {

    var self = this;

    // list of `employee` value/display objects
    self.employees        = loadAll();
    self.querySearch   = querySearch;

    // ******************************
    // Template methods
    // ******************************

    self.cancel = function($event) {
      $mdDialog.cancel();
    };
    self.finish = function($event) {
      $mdDialog.hide();
    };

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for employees... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      return query ? self.employees.filter( createFilterFor(query) ) : self.employees;
    }

    /**
     * Build `employees` list of key/value pairs
     */
    function loadAll() {
      var allEmployees = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allEmployees.split(/, +/g).map( function (employee) {
        return {
          value: employee.toLowerCase(),
          display: employee
        };
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(employee) {
        return (employee.value.indexOf(lowercaseQuery) === 0);
      };

    }
  }
