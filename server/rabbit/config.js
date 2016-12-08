'use strict';

export default {
  name: process.env.CONF_RABBIT_LOGIN || 'guest',
  password: process.env.CONF_RABBIT_PASSWORD || 'guest',
  host: process.env.CONF_RABBIT_HOST || 'localhost',
  port: process.env.CONF_RABBIT_PORT || '5672'
};