app.directive('adminTabs', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/admin/directives/html/admin-tabs.html'
        // ,
        // transclude: true,
        // scope: {},
        // controller: ['$scope', function AdminTabsController($scope) {
        //     var panes = $scope.panes = [];
        //     $scope.select = function(pane) {
        //         angular.forEach(panes, function(pane) {
        //             pane.selected = false;
        //         });
        //         console.log('check out this pane', pane)
        //         pane.selected = true;
        //     };

        //     this.addPane = function(pane) {
        //         if (panes.length === 0) {
        //             $scope.select(pane);
        //         }
        //         panes.push(pane);
        //     };
        // }]
    }
})

// app.directive('usersList', function($document) {
//     return {
//         require: 'adminTabs',
//         restrict: 'E',
//         transclude: true,
//         scope: {},
//         link: function(scope, element, attrs, tabsCtrl) {
//             tabsCtrl.addPane(scope);
//         },
//         templateUrl: 'js/admin/directives/html/users.list.admin.html'
//     };
// })
