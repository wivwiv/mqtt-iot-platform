'use strict'

const { Service } = require('egg')

class ClientService extends Service {
  async messagePublish(topic, payload, _option = {}) {
    const option = Object.assign({}, { qos: 1, retain: false }, _option)
    return await this.ctx.helper.emqxAPI().post('/mqtt/publish', {
      topic,
      payload,
      qos: option.qos,
      retain: option.retain,
    })
  }
}

module.exports = ClientService
