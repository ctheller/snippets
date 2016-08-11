app.config(function ($stateProvider) {
    $stateProvider.state('mailer', {
        url: '/mailer',
        templateUrl: 'js/mailerTest/mailer.html',
        controller: 'MailerCtrl'
    });
});


app.controller('MailerCtrl', function ($scope) {


});
