var peerTutorServices = angular.module('peerTutorServices', ['ngResource']);

peerTutorServices.factory('API_BASE', function ($location) {
  if ($location.host() == 'localhost') {
    return "http://localhost:12130/api/";
  } else {
    return "/api/";
  }
});

peerTutorServices.factory('Tutors', function ($resource, API_BASE) {
  return $resource(API_BASE + 'tutors', null, {'get': {method: 'GET', cache: false, isArray: true}});
});

peerTutorServices.factory('Subjects', function ($resource, API_BASE) {
  return $resource(API_BASE + 'subjects', null, {'get': {method: 'GET', cache: true, isArray: true}});
});

peerTutorServices.factory('Dorms', function ($resource, API_BASE) {
  return $resource(API_BASE + 'dorms', null, {'get': {method: 'GET', cache: true, isArray: true}});
});

peerTutorServices.factory('DutyDays', function ($resource, API_BASE) {
  return $resource(API_BASE + 'duty_days', null, {'get': {method: 'GET', cache: true, isArray: true}});
});
