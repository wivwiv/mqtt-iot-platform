'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const { Schema } = mongoose

  const payloadSchema = new Schema({
    clientId: { type: String, index: true, comment: '客户端 ID' },
    topic: { type: String, index: true, comment: '消息主题' },
    qos: { type: Number, comment: 'QoS' },
    length: { type: Number, comment: '消息大小' },
    payload: { type: String, comment: '消息字符内容' },
    raw: {
      type: Object,
      comment: '消息对象 (消息是 JSON 时)',
    },
    isJSON: { type: Boolean, comment: '是否是 JSON' },
  }, {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  })

  payloadSchema.pre('save', function(next) {
    if (this.isJSON !== undefined) {
      return next()
    }
    try {
      this.raw = JSON.parse(this.payload)
      this.isJSON = true
    } catch (e) {
      this.raw = {}
      this.isJSON = false
    }
    next()
  })

  return mongoose.model('payload', payloadSchema)
}

