var peerTutorControllers = angular.module('peerTutorControllers', ['chieffancypants.loadingBar', 'ngAnimate', 'ngSanitize']);

peerTutorControllers.controller('AppCtrl', function ($scope, $http, $q, Subjects, Dorms, DutyDays, Tutors) {
  $scope.subjects = Subjects.get();
  $scope.dorms = Dorms.get();
  $scope.dutyDays = DutyDays.get();

  $q.all([$scope.subjects.$promise, $scope.dorms.$promise, $scope.dutyDays.$promise]).then(function (result) {
    // do some data post-processing
    //

    // add a null entry to subjects so that user can choose to
    // view all subjects
    $scope.subjects.splice(0, 0, {id: 'null', name: 'All subjects'})

    // create index by id for fast lookup in filters
    //
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

    // now watch for changes on query conditions
    $scope.$watch(function() {return angular.toJson($scope.queryObject())}, $scope.findTutors);

    // initialize values and trigger an update to load initial tutors
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
    ga('send', 'event', 'query', 'subject', $scope.subject);
    ga('send', 'event', 'query', 'dorm', $scope.dorm);
    ga('send', 'event', 'query', 'dutyDay', $scope.dutyDay);
  };

});

peerTutorControllers.controller('QueryCtrl', function ($scope) {

});

peerTutorControllers.controller('ListCtrl', function ($scope, $timeout) {
  $scope.mailtoClicked = function(tutor) {
    // delay 100ms to let the mailto: operations finish
    // or else chrome (as of 33) would cancel all requests
    $timeout(function() {
      ga('send', 'event', 'click', 'tutor', tutor.email_prefix);
    }, 100);
  }
});
