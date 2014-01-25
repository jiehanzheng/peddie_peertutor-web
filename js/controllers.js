var peerTutorControllers = angular.module('peerTutorControllers', ['chieffancypants.loadingBar', 'ngAnimate', 'ngSanitize', 'LocalStorageModule']);

peerTutorControllers.controller('AppCtrl', function ($scope, $http, $q, localStorageService, Subjects, Dorms, DutyDays, Tutors) {
  $scope.subjects = Subjects.get();
  $scope.dorms = Dorms.get();
  $scope.dutyDays = DutyDays.get();

  // after subjects, dorms, and days are loaded--
  $q.all([$scope.subjects.$promise, $scope.dorms.$promise, $scope.dutyDays.$promise]).then(function (result) {
    // create index by id for fast lookup in filters
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

    // add a null entry to subjects so that user can choose to view all subjects
    $scope.subjects.splice(0, 0, {id: 'null', name: 'All subjects'})

    // now watch for changes on query conditions
    $scope.$watch(function() {return angular.toJson($scope.queryObject())}, $scope.findTutors);

    // initialize values and trigger an update to load initial tutors
    restoreSelection() || $scope.clearSelection();
  });

  $scope.clearSelection = function() {
    $scope.subject = "null";
    $scope.dorm = "null";
    $scope.dutyDay = "null";
  }

  var restoreSelection = function() {
    try {
      // var storedSubject, storedDorm;
      if (localStorageService.get('updated_at')) {
        $scope.subject = String(localStorageService.get('subject'));
        $scope.dorm = String(localStorageService.get('dorm'));
        $scope.dutyDay = "null";  // always set day to null to force user to select a day
        console.debug("Restored subject = " + $scope.subject + " and dorm = " + $scope.dorm + " from localStorage.");
        return true;
      }
    } catch (e) {
      console.error("Error while restoring from localStorage: " + e);
      localStorageService.clearAll();
    }

    console.debug("Nothing is in localStorage.");
    return false;
  }

  $scope.queryObject = function() {
    return {subject: $scope.subject, dorm: $scope.dorm, duty_day: $scope.dutyDay};
  }

  $scope.findTutors = function() {
    $scope.tutors = Tutors.get($scope.queryObject());

    // save current selection to local storage
    localStorageService.add('updated_at', new Date().getTime());
    localStorageService.add('subject', $scope.subject);
    localStorageService.add('dorm', $scope.dorm);

    // log this event with ga
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

peerTutorControllers.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('tutor_query');
});
