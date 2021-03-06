"use strict";

/**
 * @ngdoc function
 * @name scheduleBuilderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scheduleBuilderApp
 */
angular
  .module("scheduleBuilderApp")
  .controller("BuildCtrl", function($scope, $http, toastr, httpService) {
    $scope.allClasses = [];
    $scope.showBtns = false;

    $scope.clearAll = function() {
      $scope.viableSchedules = [];
      $scope.formatRequest = [];
      $scope.userClasses = [];
      toastr("warning", "Potential classes have been cleared");
    };

    httpService.getClasses().then(function(r) {
      $scope.allClasses = r.data;
      console.log('classes are ready to go!');
    });

    $scope.userClasses = [];
    $scope.addUserClasses = function(course) {
      $scope.userClasses.push(course);
    };

    $scope.edit = true;
    $scope.toggleEdit = function() {
      $scope.edit = !$scope.edit;
    };

    $scope.removeClass = function(classObj) {
      var idx = $scope.userClasses.indexOf(classObj);
      if (idx > -1) {
        $scope.userClasses.splice(idx, 1);
      }
      console.log($scope.userClasses);
    };
  
    var schedCount = 0;
    var viableSchedules = [];
    $scope.viableSchedules = [];
    $scope.formatRequest = [];
    $scope.generateSchedule = function(classArr) {
      for (var i = 0; i < classArr.length; i++) {
        $scope.formatRequest.push(classArr[i].description);
      }

      if ($scope.formatRequest.length === 0) {
        toastr("error", "One or more classes required");
      } else {
        toastr("success", "Your schedules are being prepared!");
        var submissionObj = { classes: $scope.formatRequest, block: [] };
        httpService.postClass(submissionObj).then(function(r) {
          viableSchedules = r.data;
          $scope.viableSize = viableSchedules.length;
          $scope.showCount = schedCount + 1;
          $scope.vSched = viableSchedules[schedCount];
          $scope.showBtns = true;

          var tmpTime = [];
          var tmpDay = [];
          for(var i =0; i < $scope.vSched.length; i++){
            tmpTime.push($scope.vSched[i].Times.split(" "));
            tmpDay.push($scope.vSched[i].Days);
          }
          console.log(tmpDay);
          console.log(tmpTime);
          time2utc(tmpTime)
          // var foobar = tmpTime[0].splice(0, 1);
          // console.log(foobar);
          // foobar = foobar.pop().slice(0, 5);
          // console.log(foobar);
          // var now = new Date();
          // var poopy = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), foobar.slice(0, 1));
          // console.log(poopy.toISOString());
          // console.log(poopy.toUTCString());
        });
      }
    }; 

    var scheduleUtc = []
    var time2utc = function(timeArr){
      for(var i=0; i<timeArr.length; i++){
        var tmpVar = timeArr[i].splice(0, 1);
        if (tmpVar !== '-'){
          tmpVar = tmpVar.pop().slice(0, 5);
          var now = new Date();
          var poopy = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), tmpVar.slice(0, 1));
          console.log(poopy.toISOString());
          console.log(poopy.toUTCString());
          scheduleUtc.push(poopy.toISOString());
        }
      }
      console.log(scheduleUtc)
    }

    // Next and Prev page loads the schedule before or after your current schedule!
    $scope.nextPage = function() {
      if (schedCount === $scope.viableSize - 1) {
        schedCount = 0;
      } else {
        schedCount = schedCount + 1;
      }
      $scope.showCount = schedCount + 1;
      $scope.vSched = viableSchedules[schedCount];
    };
    $scope.prevPage = function() {
      if (schedCount === 0) {
        schedCount = $scope.viableSize - 1;
      } else {
        schedCount = schedCount - 1;
      }
      $scope.showCount = schedCount + 1;
      $scope.vSched = viableSchedules[schedCount];
    };
  });
