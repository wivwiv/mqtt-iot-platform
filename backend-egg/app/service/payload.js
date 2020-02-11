'use strict'

const { Service } = require('egg')

class PayloadService extends Service {
  create(payload) {
    return this.ctx.model.Payload.create(payload)
  }
}

module.exports = PayloadService
