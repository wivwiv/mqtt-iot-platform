'use strict'
const mqtt = require('mqtt')

module.exports = app => {
  const clients = []

  function close(client) {
    if (!client) {
      return
    }
    client.end()
    client = null
  }

  function start() {
    const { address, queueSize = 2, topic, option } = app.config.mqtt
    for (let i = 0; i < queueSize; i++) {
      let reconnectTime = 0
      const MAX_RECONNECT_TIMES = 100

      const client = mqtt.connect(address, option)
      client.on('connect', () => {
        reconnectTime = 0
        client.subscribe(topic)
        console.log('MQTT Connected queue', i)
      })
      client.on('reconnect', () => {
        console.log('Client', i, 'reconnecting', reconnectTime)
        if (reconnectTime > MAX_RECONNECT_TIMES) {
          close(client)
          return
        }
        reconnectTime += 1
      })
      client.on('error', error => {
        console.log('Error:', error.message)
      })
      client.on('message', handleMessage)
      clients[i] = client
    }
  }

  async function handleMessage(topic, message, { length, qos }) {
    const messageText = message.toString()
    const payload = { clientId: '', topic, length, qos, payload: messageText }
    try {
      payload.raw = JSON.parse(messageText)
      payload.clientId = payload.clientId
      payload.isJSON = true
    } catch (e) {
      payload.isJSON = false
      payload.raw = {}
    }
    await app.model.Payload.create(payload)
  }

  start()
}
