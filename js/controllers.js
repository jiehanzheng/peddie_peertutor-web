var peerTutorControllers = angular.module('peerTutorControllers', ['chieffancypants.loadingBar', 'ngAnimate', 'ngSanitize', 'LocalStorageModule']);

peerTutorControllers.controller('AppCtrl', function ($scope, $log, $q, localStorageService, $timeout, Subjects, Dorms, DutyDays, Tutors) {
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

    // add a null entry to subjects and dorms so that user can choose to view all subjects/dorms
    $scope.subjects.splice(0, 0, {id: 'null', name: 'All subjects'});
    $scope.dorms.splice(0, 0, {id: 'null', name: 'Any location'});
    $scope.dutyDays.splice(0, 0, {id: 'null', name: 'Any day'});

    // now watch for changes on query conditions
    $scope.$watch(function() {return angular.toJson($scope.queryObject())}, $scope.findTutors);

    // initialize values and trigger an update to load initial tutors
    restoreSelection() || $scope.clearSelection();

    // this element is visible only if the screen is wide enough
    var tourEntryElement = angular.element('#tour_entry');
    if (tourEntryElement.filter(':visible').length) {
      $log.log("Width ok.  Initializing tour...");
      $scope.tour = initializeTour();
      $scope.tour.init();
      $scope.tour.start();
    } else {
      // disable tour link forever
      tourEntryElement.removeClass('hidden-xs').addClass('hidden');
    }
  });

  $scope.clearSelection = function() {
    $scope.subject = "null";
    $scope.dorm = "null";
    $scope.dutyDay = "null";
  }

  var restoreSelection = function() {
    try {
      if (localStorageService.get('updated_at')) {
        $scope.subject = String(localStorageService.get('subject'));
        $scope.dorm = String(localStorageService.get('dorm'));
        $scope.dutyDay = "null";  // always set day to null to force user to select a day
        $log.log("Restored subject = " + $scope.subject + " and dorm = " + $scope.dorm + " from localStorage.");
        return true;
      }
    } catch (e) {
      $log.error("Error while restoring from localStorage: " + e);
      localStorageService.clearAll();
    }

    $log.log("Nothing is in localStorage.");
    return false;
  };

  $scope.queryObject = function() {
    return {subject: $scope.subject, dorm: $scope.dorm, duty_day: $scope.dutyDay};
  };

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

  var initializeTour = function() {
    var tour = new Tour();

    var ensureNonEmptyList = function(tour) {
      if ($scope.tutors !== undefined && $scope.tutors.length)
        return;

      $log.log("Tutor list is empty.  Setting COMPSCI/POTTER_SOUTH as an example and returning a Promise...");

      $scope.subject = "COMPSCI";
      $scope.dorm = "POTTER_SOUTH";
      $scope.dutyDay = "null";
      $scope.tutors = Tutors.get($scope.queryObject());

      return $scope.tutors.$promise;
    };

    tour.addSteps([
      {
        element: '#instructions .panel-heading',
        title: 'Welcome!',
        content: 'Follow a quick tour to learn how to find a tutor in a few clicks!',
        placement: 'left'
      },
      {
        element: '#query_form',
        title: 'Tutor filters',
        content: 'Select a subject, your dorm, and the weekday that you need help on. &nbsp;The list updates automatically as you select.',
        backdrop: true
      },
      {
        element: '#subject_select',
        title: 'Subject filter',
        content: 'Show only tutors that can tutor a certain subject.',
        backdrop: true
      },
      {
        element: '#dorm_select',
        title: 'Dorm preference',
        content: 'Choose your dorm from the dropdown menu, and we will show tutors who live closest to you on the top of the list.',
        backdrop: true
      },
      {
        element: '#day_select',
        title: 'Day selection',
        content: 'Make sure you always select the correct day, so that you can find tutors who are on duty that day. &nbsp;<strong>Please do not contact a tutor who is not on duty!</strong>',
        backdrop: true
      },
      {
        element: '#result_list',
        title: 'Tutor list',
        content: 'Here we show all tutors that match your criteria. &nbsp;Matching elements are shown in <span class="text-success">green</span>.',
        placement: 'top',
        onShow: ensureNonEmptyList,
        backdrop: true
      },
      {
        element: '#result_list li.tutor:first',
        title: 'Contacting a tutor',
        content: '<strong>You need to contact your tutor either before or during study hall</strong> so that your tutor can better arrange his/her time.',
        placement: 'top',
        onShow: ensureNonEmptyList,
        backdrop: true
      },
      {
        element: '#result_list li.tutor:first .mailto-link',
        title: 'Quick mailto: link',
        content: 'Click this icon to compose an email to this tutor. &nbsp;The tutor&rsquo;s email address, and template of the email will be filled in automatically through this link&mdash;so you only need to edit a few details and hit Send!',
        onShow: ensureNonEmptyList,
        backdrop: true
      },
      {
        element: '#policies',
        title: 'Policies',
        content: 'Be sure to read our policies carefully so everyone will be happy!',
        placement: 'left',
        backdrop: true
      },
      {
        element: '#tour_entry',
        title: 'Thanks for taking the tour!',
        content: 'You may do this tour again by clicking &ldquo;Take the tour&rdquo; any time. &nbsp;Please let <a href="mailto:jzheng-14@peddie.org">Jiehan</a> know if you have any questions on this lookup system.',
        placement: 'left',
        backdrop: true
      }
    ]);

    return tour;
  }

  $scope.forceStartTour = function() {
    if ($scope.tour !== undefined)
      $scope.tour.restart();
  };

  $scope.setCurrentTutor = function(tutor) {
    $scope.currentTutor = tutor;
    $timeout(function() {
      angular.element('#tutor_picture_modal').modal();
      ga('send', 'event', 'click', 'tutor_pic', tutor.email_prefix);
    });
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
  };
});

peerTutorControllers.controller('TutorPictureCtrl', function ($scope) {

});

peerTutorControllers.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('tutor_query');
});
