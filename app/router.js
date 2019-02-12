'use strict'

module.exports = app => {
  const { router, controller } = app

  router.prefix('/api')

  router.get('查看消息列表', '/payload', controller.home.listPayload)
  router.get('查看消息详情', '/payload/:id', controller.home.showPayload)
  router.delete('删除消息', '/payload/:id', controller.home.deletePayload)

  router.get('获取设备列表', '/devices', controller.home.listDevice)
  router.post('创建设备', '/devices', controller.home.createDevice)
  router.get('获取设备详情', '/devices/:id', controller.home.showDevice)
  router.put('更改设备', '/devices/:id', controller.home.updateDevice)
  router.delete('删除设备', '/devices/:id', controller.home.deleteDevice)

  router.post('下发消息到设备', '/devices/:id/publish', controller.home.publishToDevice)

  router.get('获取 API', '/', controller.home.showApi)

  // EMQ X  Auth
  router.post('EMQ X 连接认证', '/connect/auth', controller.home.deviceConnectAuth)
  // EMQ X Status
  router.post('EMQ X 设备状态', '/connect/status', controller.home.deviceConnectStatus)

}
