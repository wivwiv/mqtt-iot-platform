const mqtt = require('mqtt')
const axios = require('axios')

axios.defaults.baseURL = 'http://127.0.0.1:7001/api'

const taskId = Math.random().toString(16).slice(3)

let msgCount = 0

console.log('启动示例，示例 ID：', taskId)

axios.post('/devices', { name: taskId }).then(res => {
  const { clientId, password, username } = res.data

  const client = mqtt.connect('mqtt://127.0.0.1:1883', {
    clientId,
    username,
    password,
  })
  client.on('connect', () => {
    console.log('设备已连接', taskId)

    client.subscribe({ 'room/+/cmd': 1, 'user/#': 0 }, () => {
      console.log('订阅成功')

      setInterval(() => {
        client.publish(`room/${taskId}/cmd`, `${taskId} 的 cmd 消息`)

        client.publish(`user/${taskId}`, `${taskId} 的 user 消息`)

        client.publish(`$client/${clientId}`, `${taskId} 的代理订阅消息`)

      }, 5000)
    })

    client.on('message', (topic, message) => {
      msgCount += 1
      console.log(`收到消息 ${msgCount}, topic: ${topic}, message: ${message.toString()}\n`)
    })

  })

}).catch(console.error)
