# Egg.js Quick Start IoT Application Service Development

> 2020.02.10
> Important notice:
> Egg.js backend has stopped development, please use the background based on Nest.js framework, [Click here](./nest-backend/README.md)


[中文文档](./README.zh-CN.md) | English Document

## The IoT Platform in Nest.js is coming.

[Click here](./nest-backend/README.md)

- ACL/Auth Admin WEB and API
- Message Publish WEB and API
- Device Management WEB and API, include banned, proxy subscription, online status, kick off
- Store messages via InfluxDB and analysis like [EMQ X + InfluxDB + Grafana MQTT IoT data visualization](https://wivwiv.com/post/emq-x-%E4%B8%8E-influxdb-grafana-%E7%89%A9%E8%81%94%E7%BD%91%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96%E9%9B%86%E6%88%90%E6%96%B9%E6%A1%88/#more)
- QoS 1/QoS 2 Acked and Deliver status track
- EMQ X config generator like [https://nginxconfig.io](https://nginxconfig.io)
- Cluster deployment, fully implemented through EMQ x broker open source


Use Egg.js with the help of EMQ X Broker message middleware to quickly develop an IoT application server based on the MQTT protocol, and implement multiple protocols such as WebSocket and MQTT access communication.

This project is derived from [EMQ X Cloud](https://cloud.emqx.io?spm=wivwiv) technology and scheme verification.

This project integrates EMQ X Broker plug-ins and APIs through Egg.js to achieve communication access, connection authentication, status recording, and message persistence. It can be used as a web instant application, IM communication, and IoT communication model.

> This project is only for personal study/work verification EMQ X and MQTT functions.

The starting blog address (more EMQ X MQTT related integration solutions):
- Seriously digging the W I V blog site: [https://wivwiv.com/](https://wivwiv.com/)

MQTT experience access address:
- MQTT TCP: `mqtt://broker.emqx.io:1883`
- MQTT WebSocket: `ws://broker.emqx.io:8083/mqtt`
- Online MQTT Pub/Sub: `http://tools.emqx.io/`

API list view:
- API list: `http://localhost:7001/api/`

### function list

- [x] Device management
- [x] Device access control
- [ ] Device publish and subscribe, rights management
- [x] message persistence
- [x] Message query
- [x] Message delivery HTTP API
- [ ] User Management
- [ ] Multi-user support
- [ ] docker-composes


### MQTT Publish and Subscribe Model

[MQTT](https://www.ibm.com/developerworks/cn/iot/iot-mqtt-why-good-for-iot/index.html) is a lightweight and flexible network protocol. Communication messages are organized by topic, such as:

```
chat/room/1

chat/room/1/control

chat/user/wivwiv

sensor/10/temperature

sensor/+/temperature

```

Topics are separated by `/`, supporting `+`, `#` wildcards:

```
'+': Wildcard a level, such as a/+, matching a/x, a/y

'#': Wildcard multiple levels, such as a/#, matching a/x, a/b/c/d
```


### system structure

- The device selects the appropriate access protocol to access the messaging middleware:
  - Browser environment: WebSocket
  - Node.js environment: MQTT, WebSocket
  - Hardware equipment: MQTT, MQTT-SN, CoAP


- Unified authentication for message middleware: call authentication service interface for connection authentication through EMQ X HTTP Auth plug-in

- System switch device online status: call-related interface through EMQ X WebHook plugin

- Message middleware performs ACL authentication when the device publishes a message, such as:
  - xx devices only have subscription rights under yy topic
  - Only x devices have publishing permissions under the y theme

- Broker forwards messages to related topics, and the persistence service persists all messages to the database

![](./docs/_assets/topology.png)

> The EMQ X Broker open-source version has no persistence function. This system uses the MQTT client to subscribe to the wildcard topic (#) on the server-side to write all messages to the database simultaneously (this method has performance and reliability issues).

What are the advantages of writing WebSocket and TCP services directly with Node.js?

- Performance issues: professional Broker;
- Protocol support: multiple protocols access, commonly used MQTT, WebSocket, HTTP protocols are supported;
- Complete functions: communication (publish and subscribe) permissions, device status management, and data persistence solutions are all available.


### EMQ X Installation Configuration

[EMQ X Download](http://emqtt.com/downloads) It is recommended to download the 3.0+ version.

#### Connection authentication

See backend code for `controller.home.deviceConnectAuth`

https://github.com/emqx/emqx-auth-http

Modify the configuration file:

```
## etc/plugins/emqx_auth_http.conf
vi etc/plugins/emqx_auth_http.conf
```

```
## HTTP Authentication Address
auth.http.auth_req = http://127.0.0.1:7001/api/connect/auth

## HTTP authentication method
auth.http.auth_req.method = post

## body parameter, if you want to customize, you can add it after the comma
auth.http.auth_req.params = clientId=%c,username=%u,password=%P

```

Note: The authentication API responds with HTTP status 20X for authentication success, 40X for the authentication failure.

The plugin also has ACL capabilities.

#### Online and offline status

The back-end code see `controller.home.deviceConnectStatus`

https://github.com/emqx/emqx-web-hook

Modify the configuration file:

```
## etc/plugins/emqx_web_hook.conf
vi etc/plugins/emqx_web_hook.conf
```

```
## callback address
web.hook.api.url = http://127.0.0.1:7001/api/connect/status

## Keep two, comment out the others

web.hook.rule.client.connected.1 = {"action": "on_client_connected"}
web.hook.rule.client.disconnected.1 = {"action": "on_client_disconnected"}

```



Launch EMQ X:
```
./bin/emqx start
```

Start the HTTP authentication plugin:
```
./bin/emqx_ctl plugins load emqx_auth_http
./bin/emqx_ctl plugins load emqx_web_hook
```

Simple management:

Visit http://127.0.0.1:18083 EMQ X Management Console.

#### Agent Subscription

EMQ X supports multiple proxy subscriptions, which automatically subscribe to topics in a specific format for the device after the device is connected to control communication.

Open the EMQ X configuration file `etc/emqx.conf` and find the relevant configuration items of the Subscription Module. You can configure multiple automatic subscription items after the device is connected:

```bash
## Subscription Module

## Enable subscription module
module.subscription = on

## Subscribe the Topics automatically when client connected.
module.subscription.1.topic = $ client /% c
## Qos of the subscription: 0 | 1 | 2
module.subscription.1.qos = 0
```

Supports placeholders,% c is the clientId of the device, that is, each device will automatically subscribe to the `$ client /: clientId` main after a successful connection

#### EMQ X Management Monitoring API

https://docs.emqx.io/broker/latest/cn/rest.html

### Device access

JavaScript MQTT client recommends [MQTT.js](https://www.npmjs.com/package/mqtt). For specific usage examples, see `public/index.html` and` AutoRun.js`,

After the system is running, you can view the communication effect after executing `node AutoRun.js` in multiple windows at the same time.


Quick access code:

```js
const mqtt = require ('mqtt')

const clientId = 'xxx'
const client = mqtt.connect ('mqtt://127.0.0.1:1883', {
  clientId,
  username: 'xxx',
  password: 'xxx',
})

client.on ('connect', () => {
    console.log ('Device is connected')
    // {topic1: qos, topic2: qos}
    client.subscribe ({'room/+/cmd': 1, 'user/#': 0, '#': 0}, () => {
      console.log ('Subscription succeeded')

      setInterval (() => {
        client.publish (`room/$ {clientId}/cmd`,` cmd message for ${clientId} `)

        client.publish (`user/$ {clientId}`, `user message for ${clientId}`)

        client.publish (`$client/${clientId}`, `Broker subscription message for $ {clientId}`)
      }, 5000)
    })
})

client.on ('message', (topic, message) => {
  console.log (`Received message topic: ${topic}, message: ${message.toString ())`)
})
```


### Service startup configuration

MongoDB connection:
```js
// config/config. *. js
config.mongoose = {
  url: 'mongodb: //127.0.0.1: 27017/egg_iot_with_mqtt',
}
```

Server EMQ X connection:
```js
// config/config. *. js
config.mqtt = {
  address: 'mqtt://127.0.0.1: 1883',
  queueSize: 4, // number of shared subscriptions
  topic: '$queue/#', // Subscribe to topic, see MQTT protocol topic for details
  // Certification Information
  option: {
    username: 'super_user_client',
    password: '_this_is_secrect_',
  },
}
```


### Local development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```



### Deployment

```bash
$ npm start
$ npm stop
```



### Basic Demo

```
http://127.0.0.1:7001/index.html
```



### API Quick Tour

```json
[
  {
    "path": "/api/payload",
    "name": "View Message List",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/payload/:id",
    "name": "View message details",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/payload/:id",
    "name": "Delete message",
    "methods": [
      "DELETE"
    ]
  },
  {
    "path": "/api/devices",
    "name": "Get Device List",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/devices",
    "name": "Create Device",
    "methods": [
      "POST"
    ]
  },
  {
    "path": "/api/devices/:id",
    "name": "Get Device Details",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/devices/:id",
    "name": "Change Device",
    "methods": [
      "PUT"
    ]
  },
  {
    "path": "/api/devices/:id",
    "name": "Remove Device",
    "methods": [
      "DELETE"
    ]
  },
  {
    "path": "/api/devices/:id/publish",
    "name": "Send a message to the device",
    "methods": [
      "POST"
    ]
  },
  {
    "path": "/api/",
    "name": "Get API",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/connect/auth",
    "name": "EMQ X Connection Authentication",
    "methods": [
      "POST"
    ]
  },
  {
    "path": "/api/connect/status",
    "name": "EMQ X device status",
    "methods": [
      "POST"
    ]
  }
]
```



### koa-queries

`/api/payload` and`/api/devices` use the [koa-queries] (https://www.npmjs.com/package/koa-queries) middleware, and you can customize the filter query list:

- Refine search: `?${Key}__is=${value}`
 - http://localhost:7001/api/devices?clientId__is = 3457beb0-1e0b-11e9-a946-394b108d0c12

-Fuzzy search: `?${Key}__like=${value}`
 - http://localhost:7001/api/devices?clientId__like= 3457beb0-1e0b-11e9-a946-394b108d0c12

- Field nesting: `?${Key.subKey.subKey}__is=${value}`
 - http://localhost:7001/api/payload?raw.cmd.status__is=0&isJSON__is=true

\n
