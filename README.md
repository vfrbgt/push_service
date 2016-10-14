# Push Service

# Get Strated

For using service you need install rabbitmq, nodejs and mongodb on your server.

# Register developer api key:

1. Enter in https://console.firebase.google.com/
2. Create your project
3. Enter in setup project
4. Go to cloud messaging tab
5. Create cloud message api key

# Enter config data:

1. Complete data in server/db/config.js on mongodb config data.
2. Complete data in server/rabbit/config.js on rabbitmq conifg data.
3. Complete gcmApiKey const in server/model/push.js on your api key from https://console.firebase.google.com/
4. Edit server/static/manifest.json file your data from https://console.firebase.google.com/ (gcm_sender_id = user identifier)

# Run service

```bash
npm install
npm start
```

# Send push

For push sending your must send message to rabbitmq queue with name send_push.

Required data fields:

```javascript
{
	title: 'Hello',
    body: 'World',
    icon: '',
    tag: '',
    link: '',
    project: 'projectname',
    group: 'groupforsend'
}
```


# Example using service on nodejs+ampq

```javascript
const amqp = require('amqp');

var connection = amqp.createConnection({
  host: 'localhost',
  port: '5672',
  login: 'guest',
  password: 'guest'
});

connection.on('error', function(e) {
  console.log('Error rabbitmq!');
  console.log(e);
});

connection.on('ready', function () {
	default_exchange = connection.exchange();

	setTimeout(() => {
		default_exchange.publish('send_push', {
			title: 'Hello',
    	    body: 'World',
    	    icon: '',
    	    tag: '',
    	    link: '',
    	    project: 'test',
    	    group: 'all',
		}, {}, (res, err) => {
			console.log('Sended!', res, err);
		});
	}, 2000);
});
```