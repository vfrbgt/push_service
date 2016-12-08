'use strict';

const DB_HOST = process.env.CONF_MONGO_HOST || 'localhost';
const DB_NAME = process.env.CONF_MONGO_DB_NAME || 'push-service';

export const development = 'mongodb://'+DB_HOST+'/'+DB_NAME;

export const localClient = {
  name: 'local',
  id: 'local',
  secret: 'local',
};