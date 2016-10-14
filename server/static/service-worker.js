'use strict';

console.log('Started', self);

var logging = true;
var link = 'https://vipparcel.com/';
var icon = '/images/icon-192x192.png';

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Push message', event);
  var title = 'Push message';

  event.waitUntil(
    self.registration.pushManager.getSubscription().then(function (subscription) {
      var subscriptionId = null;
      subscriptionId = endpointWorkaround(subscription.endpoint);

      fetch('/api/push/'+subscriptionId, {
          method: 'get'
      }).then(function (response) {
          if (response.status !== 200) {
              if (logging) console.log('Looks like there was a problem. Status Code: ' + response.status);
              return false;
          }

          return response.json().then(function (result) {
              var needToBrake = false;
              if (result.error || !result || result.length == 0) {
                  if (logging) console.log('The API returned an error.');
                  needToBrake = true;
              }
              if (needToBrake) {
                return false;
              }

              var title = result.title;
              var message = result.body;
              if(result.link) {
                link = result.link;
              }
              if(result.icon) {
                icon = result.icon;
              }
              return self.registration.showNotification(title, {
                  'body': message,
                  'icon': icon
              });
          });
      }).catch(function (err) {
          if (logging) console.log('Unable to retrieve data', err.message);
      });

    }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  event.notification.close();
  var url = link;
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});


function endpointWorkaround(subscriptionId) {
    if (~subscriptionId.indexOf('https://android.googleapis.com/gcm/send')) {
        var token = subscriptionId.split("https://android.googleapis.com/gcm/send/");
        return token[1];
    } else if(~subscriptionId.indexOf('https://updates.push.services.mozilla.com/wpush/v1')) {
        var token = subscriptionId.split("https://updates.push.services.mozilla.com/wpush/v1/");
        return token[1];
    } else {
        return subscriptionId;
    }
}