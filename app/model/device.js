'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const { Schema } = mongoose

  const deviceSchema = new Schema({
    name: { type: String, comment: '设备名称', required: true },

    // MQTT 认证信息
    clientId: { type: String, default: app.uuid },
    username: { type: String, default: app.uuid },
    password: { type: String, default: app.uuid },

    enable: {
      type: Number,
      default: 0,
      comment: '是否启用',
      enum: { 0: '启用', 1: '不启用' },
    },
    status: {
      type: Number,
      default: 0,
      comment: '是否在线',
      enum: { 0: '离线', 1: '在线' },
    },
    raw: {
      type: Object,
      comment: '其他关联信息',
    },
  }, {
    timestamps: true,
  })

  return mongoose.model('device', deviceSchema)
}

