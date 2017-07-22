"use strict";

/**
 * @ngdoc function
 * @name scheduleBuilderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scheduleBuilderApp
 */
const baseUrl = "http://schedule-builder-backend.herokuapp.com/api";

angular
  .module("scheduleBuilderApp")
  .controller("BuildCtrl", function($scope, $http, toastr) {
    $scope.allClasses = [];

    $scope.clearAll = function() {
      $scope.viableSchedules = [];
      $scope.preReqClasses = [];
      $scope.userClasses = [];
      toastr("warning", "Potential classes have been cleared");
    };

    $http.get(baseUrl + "/classes").then(response => {
      $scope.allClasses = response.data;
    });

    $scope.userClasses = [];
    $scope.addUserClasses = function(val) {
      $scope.userClasses.push(val);
    };

    $scope.edit=false;
    $scope.allowEdit = function(){
      $scope.edit = !$scope.edit
    }

    $scope.removeClass = function(classObj) {
      var idx = $scope.userClasses.indexOf(classObj);
      if (idx > -1) {
        $scope.userClasses.splice(idx, 1);
      }
    };

    $scope.viableSchedules = [];
    $scope.preReqClasses = [];
    $scope.generateSchedule = function(classArr) {
      for (var i = 0; i < classArr.length; i++) {
        $scope.preReqClasses.push(
          classArr[i].originalObject.Subject +
            " " +
            classArr[i].originalObject.Course
        );
      }

      if ($scope.preReqClasses.length == 0) {
        toastr("error", "One or more classes required");
      } else {
        toastr("success", "Your schedules are being prepared!");
        $http.post(baseUrl + "/schedules", {classes: $scope.preReqClasses,block: []})
          .then(response => {
            $scope.viableSchedules = response.data;
            console.log($scope.viableSchedules);
          });
      }
    };
  });