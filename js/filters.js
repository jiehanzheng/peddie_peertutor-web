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
  };
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
  };
})

peerTutorFilters.filter('mailtoLink', function () {
  return function(tutor, dutyDay, subject) {
    var mailtoLink = "mailto:";
    mailtoLink += encodeURIComponent(tutor.email_prefix) + '@peddie.org';
    mailtoLink += '?subject=' + encodeURIComponent('Peer tutoring request' + ' ' + '(' + (subject === undefined ? "[insert subject]" : subject.name) + ')');
    mailtoLink += '&body=' + encodeURIComponent('Hi ' + (tutor.name.split(' ')[0]) + ',\n\nWould you be available on [this/next] ' + (dutyDay === undefined ? "[insert weekday]" : dutyDay.name) + ' for some ' + (subject === undefined ? "[insert subject]" : subject.name) + ' help?\n\nThanks a lot!\n\n[insert your name]');

    return mailtoLink;
  };
});

peerTutorFilters.filter('gmailHttpsMailto', function() {
  return function(mailtoUrl) {
    if (navigator.platform.match(/^(Win|Mac)/)) {  // on desktop
      // use Gmail's HTTP GET handler directly
      return "https://mail.google.com/a/peddie.org/?extsrc=mailto&url=" + encodeURIComponent(mailtoUrl);
    }

    // for other clients we trust the browser and operating system to make the 
    // best decision
    return mailtoUrl;
  };
});

peerTutorFilters.filter('tutorPicturePath', function() {
  return function(email_prefix) {
    return "/images/tutors/" + email_prefix + ".jpg";
  };
});
