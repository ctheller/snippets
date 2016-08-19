app.controller('ImgUploadCtrl', function($scope, $state, Upload, $rootScope, $mdToast, $mdDialog, $element) {

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
                console.log("uploading");
            },
            function(error) {
                $scope.errorMsg = error.code;
            },
            function() {
                // Upload completed successfully, now we can get the download URL
                var downloadURL = uploadTask.snapshot.downloadURL;
                $scope.result = downloadURL;
                firebase.database().ref().child('users').child(name).child('photoUrl').set(downloadURL);
            });

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.toastPosition = angular.extend({}, last);

        $scope.getToastPosition = function() {
            sanitizePosition();

            return Object.keys($scope.toastPosition)
                .filter(function(pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        function sanitizePosition() {
            var current = $scope.toastPosition;

            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;

            last = angular.extend({}, current);
        }

        var pinTo = $scope.getToastPosition();

        $mdToast.show(
            $mdToast.simple()
            .textContent('Photo uploaded successfully')
            .position(pinTo)
            .hideDelay(4000)
        );

        $state.go('profile');
    }

    $scope.$on('$stateChangeStart', function(){
        $element.remove();
    });

});
