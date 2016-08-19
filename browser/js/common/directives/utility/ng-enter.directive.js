app.directive('submitOnenter', function ($document) {
    return function (scope, element, attrs) {
        var form = $document.find('form[name="elasticsearch"]')
        element.bind("keypress", function (event) {
            if(event.which === 13) {
                event.preventDefault();
                var submit = jQuery.Event( "submit" );
                submit.preventDefault()
                console.log('enter')
                form.trigger('submit')

            }
        });
    };
});
