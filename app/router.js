'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/api/payload', controller.home.listPayload)
  router.get('/api/payload/:id', controller.home.showPayload)
  router.delete('/api/payload/:id', controller.home.deletePayload)

  router.get('/api/devices', controller.home.listDevice)
  router.get('/api/devices/:id', controller.home.showDevice)
  router.get('/api/devices/:id', controller.home.updateDevice)
  router.delete('/api/devices/:id', controller.home.deleteDevice)

  // EMQ X  Auth
  router.post('/api/connect/auth', controller.home.deviceConnectAuth)
}
