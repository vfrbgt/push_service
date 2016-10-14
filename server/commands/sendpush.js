'use strict';

import Push from '../models/push';
import Subscribe from '../models/subscribe';

export default (connection) => {
  connection.queue('send_push',{
    durable: true,
    autoDelete: false
  }, function (q) {
      q.bind('#');
      q.subscribe(function (message) {
        let data = message;
        if(data.project && !data.group) {
          Subscribe.find({
            'project': data.project
          }, (err, subscribes) => {
            Push.sendPush(subscribes, data);
          });
        }
        else if(data.project && data.group) {
          Subscribe.find({
            'project': data.project,
            'group': data.group
          }, (err, subscribes) => {
            Push.sendPush(subscribes, data);
          });
        }
        else {
          return false;
        }
      });
  });
};