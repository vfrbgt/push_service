'use strict';

import mongoose from 'mongoose';
import uid from 'uid';
import idValidator from 'mongoose-id-validator';
import request from 'request';

const gcmApiKey = '';

const pushSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  link: {
    type: String,
  },
  tag: {
    type: String,
  },
  project: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    transform(doc, ret) {
      delete ret._id;
      delete ret.hashed_secret;
    },
  },
});

pushSchema.plugin(idValidator);

pushSchema.pre('validate', function preSave(next) {
  if (this.isNew) {
    if (!this.id) this.id = uid(16);
  }
  next();
});

pushSchema.statics.sendPush = function sendPush (subscribes, push) {
  var regIds = [];
  subscribes.forEach((subscribe, index) => {
    let newPush = new this({
        title: push.title,
        body: push.body,
        icon: push.icon,
        tag: push.tag,
        link: push.link,
        project: subscribe.project,
        group: subscribe.group,
        token: subscribe.token
    });
    newPush.save((err) => {});
    regIds[index] = subscribe.token;
  });
  var options = {
    url: 'https://gcm-http.googleapis.com/gcm/send',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key='+gcmApiKey
    },
    json: {
      "registration_ids":regIds
    }
  };
  request.post(options, function(error, response, body) {
    // handling request
    // if(error !== null) {
    //   console.log(error);
      // exchange.publish('log_queue', {

      // });
    // }
  });
};

export default mongoose.model('Push', pushSchema);
