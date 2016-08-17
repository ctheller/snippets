app.controller('ImgUploadCtrl', function ($scope, Upload, $rootScope, $mdDialog) {

    $scope.clear = function($event){
        $scope.result = null;
        $mdDialog.show({
          targetEvent: $event,
          template: 'js/file-upload/file-upload.html',
          controller: 'FileUploadCtrl'
          // onComplete: afterShowAnimation,
        });
    }

});