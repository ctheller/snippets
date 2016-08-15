app.controller('MyCtrl', function ($scope, Upload, $timeout, $rootScope) {

    $scope.upload = function (dataUrl) {

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
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          var downloadURL = uploadTask.snapshot.downloadURL;
          firebase.database().ref().child('users').child(name).child('photoUrl').set(downloadURL);
        });


        // Upload.upload({
        //     url: 'gs://snippets-2f32c.appspot.com',
        //     data: {
        //         file: Upload.dataUrltoBlob(dataUrl, name)
        //     },
        // }).then(function (response) {
        //     console.log(response);
        //     $timeout(function () {
        //         $scope.result = response.data;
        //     });
        // }, function (response) {
        //     if (response.status > 0) $scope.errorMsg = response.status 
        //         + ': ' + response.data;
        // }, function (evt) {
        //     $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        // });
    }
});