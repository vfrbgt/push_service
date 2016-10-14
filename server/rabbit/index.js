'use strict';

import {commands} from '../commands';
import connectionData from './config';
import amqp from 'amqp';

export function connectRabbit(uri) {
  return new Promise((resolve, reject) => {
  	var connection = amqp.createConnection(connectionData);

  	connection.on('ready', () => {

  		Object.keys(commands).forEach(name => {
        if(name === 'index') {
          return false;
        }
  			commands[name](connection);
  		});

      resolve(connection);
  	});

  	connection.on('error', function(e) {
  		reject(e);
  	});

  });
}