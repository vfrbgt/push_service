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

#OR

Fullfill this env variables.
* 1. CONF_MONGO_HOST - hostsname mongodb
* 2. CONF_MONGO_DB_NAME - db name of mongodb
* 3. CONF_RABBIT_LOGIN - rabbitmq user login
* 4. CONF_RABBIT_PASSWORD - rabbitmq user password
* 5. CONF_RABBIT_HOST - rabbitmq hostsname
* 6. CONF_RABBIT_PORT - rabbitmq port
* 7. GCM_API_KEY - gcm api key from https://console.firebase.google.com

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

# Subscribe page design

Subscribe page available on http://127.0.0.1:3000
Folder with css, js, html and images files available on server/static/ folder

# Exmaple add domain name for service

This simple to do using nginx. For example

```nginx
server {
    listen 80;
    server_name push.youDomainName.com;
    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:3000;
    }
}
```

And your subscribtion page will be available on http://push.youDomainName.com

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
# Example using service on php+PhpAmqpLib

```php
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

define('AMQP_DEBUG', true);

$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$channel    = $connection->channel();
$exchange   = 'send_push';

$channel->queue_declare($exchange, false, true, false, false);
$msg = new AMQPMessage(json_encode([
    'title'   => 'Hello',
    'body'    => 'World',
    'icon'    => '',
    'tag'     => '',
    'link'    => '',
    'project' => 'test',
    'group'   => 'all',
]), ['delivery_mode' => 2]);
$channel->basic_publish($msg, '', $exchange);

$channel->close();
$connection->close();
```