var peerTutorControllers = angular.module('peerTutorControllers', ['chieffancypants.loadingBar', 'ngAnimate', 'ngSanitize']);

peerTutorControllers.controller('AppCtrl', function ($scope, $http, $q, Subjects, Dorms, DutyDays, Tutors) {
  $scope.subjects = Subjects.get();
  $scope.dorms = Dorms.get();
  $scope.dutyDays = DutyDays.get();

  $q.all([$scope.subjects.$promise, $scope.dorms.$promise, $scope.dutyDays.$promise]).then(function (result) {
    $scope.subjectsById = {}
    $scope.subjects.forEach(function (element, index, array) {
      $scope.subjectsById[element.id] = element;
    });

    $scope.dormsById = {}
    $scope.dorms.forEach(function (element, index, array) {
      $scope.dormsById[element.id] = element;
    });

    $scope.dutyDaysById = {}
    $scope.dutyDays.forEach(function (element, index, array) {
      $scope.dutyDaysById[element.id] = element;
    });

    $scope.$watch(function() {return angular.toJson($scope.queryObject())}, $scope.findTutors);
    $scope.clearSelection();
  });

  $scope.clearSelection = function() {
    $scope.subject = "null";
    $scope.dorm = "null";
    $scope.dutyDay = "null";
  }

  $scope.queryObject = function() {
    return {subject: $scope.subject, dorm: $scope.dorm, duty_day: $scope.dutyDay};
  }

  $scope.findTutors = function() {
    $scope.tutors = Tutors.get($scope.queryObject());
  };

});

peerTutorControllers.controller('QueryCtrl', function ($scope) {

});

peerTutorControllers.controller('ListCtrl', function ($scope) {
  
});
