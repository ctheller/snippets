app.factory("Email", function($rootScope, Snippet, $window) {
 
 	var Email = {};

 	Email.compose = function(){
 		var emailBody = "Greetings%20Team%2C%0A%0A%0A";
 		var makingEmailBody = $rootScope.selectedSnippetIds.map(function(id){
 			return Snippet.getSnippetById(id).$loaded().then(function(obj){
	 				emailBody += encodeURIComponent(obj.subject+":\n");
	 				emailBody += encodeURIComponent(obj.contents+"\n\n");
 			})
 		})
 		return Promise.all(makingEmailBody).then(function(){
 			emailBody += encodeURIComponent("\nRegards,\n\t"+$rootScope.user.first_name+" "+$rootScope.user.last_name);
 			var url = "https://mail.google.com/mail/u/0/?view=cm&ui=2&tf=0&fs=1&su=Status%20Update&body="+emailBody;
 			$window.open(url, '_blank');
 		})
 	}

 	return Email;

});

