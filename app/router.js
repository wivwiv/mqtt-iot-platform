'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app

  router.prefix('/api')

  router.get('/payload', controller.home.listPayload)
  router.get('/payload/:id', controller.home.showPayload)
  router.delete('/payload/:id', controller.home.deletePayload)

  router.get('/devices', controller.home.listDevice)
  router.post('/devices', controller.home.createDevice)
  router.get('/devices/:id', controller.home.showDevice)
  router.put('/devices/:id', controller.home.updateDevice)
  router.delete('/devices/:id', controller.home.deleteDevice)

  // EMQ X  Auth
  router.post('/connect/auth', controller.home.deviceConnectAuth)

  router.post('/connect/status', controller.home.deviceConnectStatus)
}
