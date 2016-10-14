var isPushEnabled = false;

function initialiseState() {
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications aren\'t supported.');
        return;
    }
    if (Notification.permission === 'denied') {
        console.warn('The user has blocked notifications.');
        return;
    }
    if (!('PushManager' in window)) {
        console.warn('Push messaging isn\'t supported.');
        return;
    }
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription) {
            var pushButton = document.querySelector('.js-push-button');
            pushButton.disabled = false;
            if (!subscription) {
                return;
            }
            sendSubscriptionToServer(subscription);
            pushButton.textContent = 'Disable Push Messages';
            isPushEnabled = true;
        }).catch(function(err) {
            console.warn('Error during getSubscription()', err);
        });
    });
}

function subscribe() {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {
            isPushEnabled = true;
            pushButton.textContent = 'Disable Push Messages';
            pushButton.disabled = false;
            return sendSubscriptionToServer(subscription);
        }).catch(function(e) {
            if (Notification.permission === 'denied') {
                console.warn('Permission for Notifications was denied');
                pushButton.disabled = true;
            } else {
                console.error('Unable to subscribe to push.', e);
                pushButton.disabled = false;
                pushButton.textContent = 'Enable Push Messages';
            }
        });
    });
}

function unsubscribe() {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription().then(function(pushSubscription) {
            if (!pushSubscription) {
                isPushEnabled = false;
                pushButton.disabled = false;
                pushButton.textContent = 'Enable Push Messages';
                return;
            }
            var subscriptionId = pushSubscription.subscriptionId;
            pushSubscription.unsubscribe().then(function(successful) {
                pushButton.disabled = false;
                pushButton.textContent = 'Enable Push Messages';
                isPushEnabled = false;
                return sendUnSubscriptionToServer(pushSubscription);
            }).catch(function(e) {
                console.log('Unsubscription error: ', e);
                pushButton.disabled = false;
                pushButton.textContent = 'Enable Push Messages';
            });
        }).catch(function(e) {
            console.error('Error thrown while unsubscribing from push messaging.', e);
        });
    });
}

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function endpointWorkaround(subscriptionId) {
    if (~subscriptionId.indexOf('https://android.googleapis.com/gcm/send')) {
        var token = subscriptionId.split("https://android.googleapis.com/gcm/send/");
        return token[1];
    } else {
        return subscriptionId;
    }
}

function sendSubscriptionToServer(subscribe) {
  var token = endpointWorkaround(subscribe.endpoint);
  $.ajax({
    type: "POST",
    url: '/api/subscribe',
    data: {
        'project': urlParam('project'),
        'token': token,
        'group': urlParam('group'),
    }
  });
  console.log(subscribe);
}

function sendUnSubscriptionToServer(subscribe) {
  var token = endpointWorkaround(subscribe.endpoint);
  $.ajax({
    type: "DELETE",
    url: '/api/subscribe',
    data: {
        'token': token
    }
  });
}

window.addEventListener('load', function() {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.addEventListener('click', function() {
        if (isPushEnabled) {
            unsubscribe();
        } else {
            subscribe();
        }
    });
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(initialiseState);
    } else {
        console.warn('Service workers aren\'t supported in this browser.');
    }
});