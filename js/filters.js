var peerTutorFilters = angular.module('peerTutorFilters', []);

peerTutorFilters.filter('expandAndHighlight', function ($sce) {
  return function(ids, dictionary, highlightIds) {
    var processedNames = []

    ids.forEach(function (id, index, array) {
      if (highlightIds.indexOf(id) > -1) {
        processedNames.push('<span class="text-success"><strong>' + dictionary[id].name + '</strong></span>');
      } else {
        processedNames.push(dictionary[id].name);
      }
    });

    return $sce.trustAsHtml(processedNames.join('<span class="text-muted">,</span> '));
  }
});

peerTutorFilters.filter('makeListItemsAndHighlight', function ($sce) {
  return function(ids, dictionary, highlightIds) {
    var processedNames = []

    ids.forEach(function (id, index, array) {
      if (highlightIds.indexOf(id) > -1) {
        processedNames.push('<li class="text-success"><strong>' + dictionary[id].name + '</strong></li>');
      } else {
        processedNames.push('<li>' + dictionary[id].name + '</li>');
      }
    });

    return $sce.trustAsHtml(processedNames.join(''));
  }
})

peerTutorFilters.filter('mailtoLink', function () {
  return function(emailPrefix, dutyDay, subject) {
    var mailtoLink = "mailto:";
    mailtoLink += encodeURIComponent(emailPrefix) + '@peddie.org';
    mailtoLink += '?subject=' + encodeURIComponent('Peer tutoring request' + ' ' + '(' + (subject === undefined ? "[insert subject]" : subject.name) + ')');
    mailtoLink += '&body=' + encodeURIComponent('Hey,\n\nWould you be available on [this/next] ' + (dutyDay === undefined ? "[insert weekday]" : dutyDay.name) + ' for some ' + (subject === undefined ? "[insert subject]" : subject.name) + ' help?\n\nThanks a lot!\n\n[insert your name]');

    return mailtoLink;
  }
});
