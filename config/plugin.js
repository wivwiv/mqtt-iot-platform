'use strict';

// had enabled by egg
// exports.static = true;
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
}

exports.security = {
  enable: false,
}

exports.static = {
  enable: true,
}
