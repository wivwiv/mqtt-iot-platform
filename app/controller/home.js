'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async listPayload() {
    const { query, filter, sort } = this.ctx.state

    let { page = 1, limit = 20 } = this.ctx.query
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    const itemsQuery = this.ctx.model.Payload.find(query, filter)
                           .sort(sort)
                           .skip((page - 1) * limit)
                           .limit(limit)
    const countQuery = this.ctx.model.Payload.countDocuments(query)

    const [items, count] = await Promise.all([itemsQuery, countQuery])
    this.ctx.body = {
      meta: { page, limit, count },
      items,
    }
  }

  async showPayload() {
    const { id } = this.ctx.params
    const payload = await this.ctx.model.Payload.findById(id)
    if (!payload) {
      this.ctx.throw(404, '', '消息不存在')
    }
    this.ctx.body = payload
  }

  async deletePayload() {
    const { id } = this.ctx.params
    const payload = await this.ctx.model.Payload.findByIdAndRemove(id, { select: ['_id'] })
    if (!payload) {
      this.ctx.throw(404, '', '消息不存在')
    }
    this.ctx.body = payload
  }

  async listDevice() {
    const { query, filter, sort } = this.ctx.state

    let { page = 1, limit = 20 } = this.ctx.query
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    const itemsQuery = this.ctx.model.Device.find(query, filter)
                           .sort(sort)
                           .skip((page - 1) * limit)
                           .limit(limit)
    const countQuery = this.ctx.model.Device.countDocuments(query)

    const [items, count] = await Promise.all([itemsQuery, countQuery])
    this.ctx.body = {
      meta: { page, limit, count },
      items,
    }
  }

  async createDevice() {
    const deviceData = this.ctx.request.body
    this.ctx.body = await this.ctx.model.Device.create(deviceData)
  }

  async updateDevice() {
    const { status, enable, raw = {} } = this.ctx.request.body
    const { id } = this.ctx.params

    const device = await this.ctx.model.Device.findByIdAndUpdate(id,
        { status, enable, raw },
        { new: true },
    )
    if (!device) {
      this.ctx.throw(404, '', '设备不存在')
    }
    this.ctx.body = device
  }

  async showDevice() {
    const { id } = this.ctx.params
    const payload = await this.ctx.model.Device.findById(id)
    if (!payload) {
      this.ctx.throw(404, '', '设备不存在')
    }
    this.ctx.body = payload
  }

  async deleteDevice() {
    const { id } = this.ctx.params
    const payload = await this.ctx.model.Device.findByIdAndRemove(id, { select: ['_id'] })
    if (!payload) {
      this.ctx.throw(404, '', '设备不存在')
    }
    this.ctx.body = payload
  }

  async showApi() {
    const { ctx } = this
    const api = this.app.router.stack.map($ => ({
      path: $.path,
      name: $.name,
      methods: $.methods,
    }))
    ctx.body = api
  }

  async deviceConnectAuth() {
    const { clientId, username, password } = this.ctx.request.body
    // 本地
    const localUsername = this.config.mqtt.option.username
    const localPassword = this.config.mqtt.option.password

    if (username === localUsername && password === localPassword) {
      this.ctx.body = { username }
      return
    }

    const device = await this.ctx.model.Device.findOne({ clientId, username, password }, '_id, enable, status')

    if (!device || device.enable === 1) {
      this.ctx.throw(401, '', '连接失败')
    }

    this.ctx.body = {
      clientId,
    }
  }

  async deviceConnectStatus() {
    const { action, client_id } = this.ctx.request.body

    let status = -1
    if (action === 'client_connected') {
      status = 1
    } else if (action === 'client_disconnected') {
      status = 0
    }
    if (status === -1) {
      this.ctx.body = {}
      return
    }
    this.ctx.body = await this.ctx.model.Device
                              .updateOne({ clientId: client_id }, { $set: { status } })
  }
}

module.exports = HomeController
