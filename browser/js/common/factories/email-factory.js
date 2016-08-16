app.factory('EmailService', function($http) {
    return {
      composeEmail: function(email) {
       return $http.post('/api/mailer', email);
      }
    };
});
