app.directive('submitSnippet', function() {
    return {
      restrict : 'E',
      scope: {
        submitted: '='
      },
      link : function(scope, element, attributes) {

        element.click(function(){
          if (scope.submitted) {
            element.removeClass( "validateit" );
            return;
          }
          element.addClass("onclic", 250, validate(event));
        })

        function validate() {
          setTimeout(function() {
            element.removeClass( "onclic" );
            element.addClass( "validateit", 400, callback(event) );
          }, 500 );
        }
        function callback() {
          element.removeClass( "validateit" );
          element.addClass( "finishit" );
        }
      }

    }
});
