app.controller('ImgUploadCtrl', function($scope, $state, Upload, $rootScope, $mdToast, $mdDialog) {

    $scope.clear = function($event) {
        $scope.result = null;
    }

    $scope.upload = function(dataUrl) {

        if (!$rootScope.user) {
            console.log("no user logged in");
            return;
        }

        var name = $rootScope.user.$id;

        var file = Upload.dataUrltoBlob(dataUrl, name);

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child('profiles/' + file.name).put(file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                $scope.uploading = true;
            },
            function(error) {
                $scope.errorMsg = error.code;
                $scope.uploading = false;
                Materialize.toast('Photo upload Failed', 1250, 'toastFailed');
            },
            function() {
                // Upload completed successfully, now we can get the download URL
                var downloadURL = uploadTask.snapshot.downloadURL;
                $scope.result = downloadURL;
                firebase.database().ref().child('users').child(name).child('photoUrl').set(downloadURL);
                Materialize.toast('Photo uploaded successfully', 1250, 'toastAddCollab');
                $scope.uploading = false;
            });


            $scope.picFile = null;

        }

});
