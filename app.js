'use strict'

module.exports = app => {
  app.beforeStart(async () => {
    require('./lib/client')(app)
  })
}