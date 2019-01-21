'use strict'

module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1548076967409_9292'

  // add your config here
  config.middleware = [ 'handleError', 'koaQueries' ]

  config.handleError = {
    match: '/api',
  }

  config.koaQueries = {
    match: '/api',
  }

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/egg_iot_with_mqtt',
  }

  config.mqtt = {
    address: 'mqtt://127.0.0.1:11883',
    queueSize: 4,
    topic: '$queue/#',
    option: {
      username: 'super_user_client',
      password: '_this_is_secrect_',
    },
  }

  return config;
}
