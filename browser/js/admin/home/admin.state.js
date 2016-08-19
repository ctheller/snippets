app.config(function($stateProvider) {
    $stateProvider.state('admin', {
            url: '/admin',
            templateUrl: 'js/admin/home/admin.html',
            controller: 'adminCtrl'
        })
        .state('admin.users', {
            url: '/admin/users',
            templateUrl: 'js/admin/users/users.admin.html',
            controller: 'usersAdminCtrl'
        })
        .state('admin.snippets', {
            url: '/admin/snippets',
            templateUrl: 'js/admin/snippets/snippets.admin.html',
            controller: 'snippetsAdminCtrl',
            resolve: {
                snippets: function(Snippet) {
                    return Snippet.getAllSnippetsAllowed()
                        .then(snippets => {
                            return snippets
                        })
                        .catch(error => console.error(error))
                }
            }
        })
});
