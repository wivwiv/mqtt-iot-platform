# Egg.js 快速入门物联网应用服务开发

使用 Egg.js 借助 EMQ X Broker 消息中间件快速开发基于 MQTT 协议的 IoT 应用服务器，实现 WebSocket、MQTT 等多种协议接入通信。

本项目通过 Egg.js 集成 EMQ X Broker 的插件、API，实现了通信接入、连接认证、状态记录、消息持久化功能，可作为网页即时应用、IM 通信、物联网通信模型。


### 功能列表

- [x] 设备管理
- [x] 设备接入控制
- [ ] 设备发布订阅、权限管理
- [x] 消息持久化
- [x] 消息查询
- [x] 消息下发 HTTP API
- [ ] 用户管理
- [ ] 多用户支持


### MQTT 发布和订阅模型

[MQTT](https://www.ibm.com/developerworks/cn/iot/iot-mqtt-why-good-for-iot/index.html) 是一种轻量级的、灵活的网络协议，其通信消息是按主题(Topic)进行组织的，列如：

```
chat/room/1

chat/room/1/control

chat/user/wivwiv

sensor/10/temperature

sensor/+/temperature

```

主题(Topic)通过 `/` 分割层级，支持 `+`， `#` 通配符:

```
'+': 表示通配一个层级，例如 a/+，匹配 a/x, a/y

'#': 表示通配多个层级，例如 a/#，匹配 a/x, a/b/c/d
```


### 系统架构

- 设备选择合适的接入协议接入到消息中间件：
  - 浏览器环境：WebSocket
  - Node.js 环境：MQTT、WebSocket
  - 硬件设备：MQTT、MQTT-SN、CoAP
 

- 消息中间件统一进行认证鉴权：通过 EMQ X HTTP Auth 插件调用认证服务接口进行连接鉴权 
 
- 系统切换设备在线状态：通过 EMQ X WebHook 插件调用相关接口

- 设备发布消息时消息中间件进行 ACL 鉴权，如：
  - xx 设备在 yy 主题下只有订阅权限
  - 只有 x 设备在 y 主题下有发布权限

- Broker 将消息转发至相关主题，持久化服务将所有消息持久化至数据库

![](./docs/_assets/topology.png)

> 迫于 EMQ X Broker 开源版没有持久化功能，本系统使用 MQTT 客户端在服务器端订阅通配符主题 (#) 将所有消息同步写入数据库(这种方式存在性能与可靠性问题)。

相比直接使用 Node.js 编写 WebSocket、TCP 服务有什么优势？

- 性能问题：专业的 Broker；
- 协议支持：多种协议接入，常用的 MQTT、WebSocket、HTTP 协议都支持；
- 功能完备：通信（发布订阅）权限、设备状态管理、数据持久化方案都有。


### EMQ X 安装配置

[EMQ X 下载](http://emqtt.com/downloads) 建议下载 3.0+ 版本。

#### 连接认证

后端代码见 `controller.home.deviceConnectAuth`

https://github.com/emqx/emqx-auth-http

修改配置文件:

```
## etc/plugins/emqx_auth_http.conf
vi etc/plugins/emqx_auth_http.conf
```

```
## HTTP 认证地址
auth.http.auth_req = http://127.0.0.1:7001/api/connect/auth

## HTTP 认证方法
auth.http.auth_req.method = post

## body 参数，如需自定义可在后面加上，逗号分隔
auth.http.auth_req.params = clientId=%c,username=%u,password=%P

```

注意：认证 API 响应 httpStatus 20X 为认证成功，40X 为认证失败。

该插件同时具有 ACL 功能。

#### 上下线状态

后端代码见 `controller.home.deviceConnectStatus`

https://github.com/emqx/emqx-web-hook

修改配置文件:

```
## etc/plugins/emqx_web_hook.conf
vi etc/plugins/emqx_web_hook.conf
```

```
## 回调地址
web.hook.api.url = http://127.0.0.1:7001/api/connect/status

## 保留两项，其他的注释掉

web.hook.rule.client.connected.1     = {"action": "on_client_connected"}
web.hook.rule.client.disconnected.1  = {"action": "on_client_disconnected"}

```



启动 EMQ X：
```
./bin/emqx start
```

启动 HTTP 认证插件：
```
./bin/emqx_ctl plugins load emqx_auth_http
./bin/emqx_ctl plugins load emqx_web_hook
```

简单管理：

访问 http://127.0.0.1:18083 EMQ X 管理控制台。

#### 代理订阅

EMQ X 支持多种代理订阅，在设备连接后为设备自动订阅特定格式的主题，用于控制通信。

打开 EMQ X 配置文件 `etc/emqx.conf`，找到 Subscription Module 相关配置项，可在设备连接后配置多个自动订阅项：

```bash
## Subscription Module

## 启用订阅模块
module.subscription = on

## Subscribe the Topics automatically when client connected.
module.subscription.1.topic = $client/%c
## Qos of the subscription: 0 | 1 | 2
module.subscription.1.qos = 0
```

支持占位符, %c 为设备的 clientId，即每个设备连接成功后将自动订阅 `$client/:clientId` 主

#### 管理监控 API

http://emqtt.com/docs/v3/rest.html#id22

### 设备接入

JavaScript MQTT 客户端推荐 [MQTT.js](https://www.npmjs.com/package/mqtt)，具体使用示例见 `public/index.html` 与 `AutoRun.js`,

系统运行后多个窗口同时执行 `node AutoRun.js` 后可以查看通信效果。


快速接入代码：

```js
const mqtt = require('mqtt')

const clientId = 'xxx'
const client = mqtt.connect('mqtt://127.0.0.1:1883', {
  clientId,
  username: 'xxx',
  password: 'xxx',
})

client.on('connect', () => {
    console.log('设备已连接')
    // { topic1: qos, topic2: qos }
    client.subscribe({ 'room/+/cmd': 1, 'user/#': 0, '#': 0 }, () => {
      console.log('订阅成功')

      setInterval(() => {
        client.publish(`room/${clientId}/cmd`, `${clientId} 的 cmd 消息`)

        client.publish(`user/${clientId}`, `${clientId} 的 user 消息`)

        client.publish(`$client/${clientId}`, `${clientId} 的代理订阅消息`)
      }, 5000)
    })
})

client.on('message', (topic, message) => {
  console.log(`收到消息 topic: ${topic}, message: ${message.toString()}`)
})
```


### 服务启动配置

MongoDB 连接:
```js
// config/config.*.js
config.mongoose = {
  url: 'mongodb://127.0.0.1:27017/egg_iot_with_mqtt',
}
```

Server EMQ X 连接:
```js
// config/config.*.js
config.mqtt = {
  address: 'mqtt://127.0.0.1:1883',
  queueSize: 4, // 共享订阅数
  topic: '$queue/#', // 订阅主题，详见 MQTT 协议主题
  // 认证信息
  option: {
    username: 'super_user_client',
    password: '_this_is_secrect_',
  },
}
```


### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```



### 部署

```bash
$ npm start
$ npm stop
```



### 基础演示

```
http://127.0.0.1:7001/index.html
```



### API 速览

```json
[
  {
    "path": "/api/payload",
    "name": "查看消息列表",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/payload/:id",
    "name": "查看消息详情",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/payload/:id",
    "name": "删除消息",
    "methods": [
      "DELETE"
    ]
  },
  {
    "path": "/api/devices",
    "name": "获取设备列表",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/devices",
    "name": "创建设备",
    "methods": [
      "POST"
    ]
  },
  {
    "path": "/api/devices/:id",
    "name": "获取设备详情",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/devices/:id",
    "name": "更改设备",
    "methods": [
      "PUT"
    ]
  },
  {
    "path": "/api/devices/:id",
    "name": "删除设备",
    "methods": [
      "DELETE"
    ]
  },
  {
    "path": "/api/devices/:id/publish",
    "name": "下发消息到设备",
    "methods": [
      "POST"
    ]
  },
  {
    "path": "/api/",
    "name": "获取 API",
    "methods": [
      "HEAD",
      "GET"
    ]
  },
  {
    "path": "/api/connect/auth",
    "name": "EMQ X 连接认证",
    "methods": [
      "POST"
    ]
  },
  {
    "path": "/api/connect/status",
    "name": "EMQ X 设备状态",
    "methods": [
      "POST"
    ]
  }
]
```



### koa-queries 魔法查询

`/api/payload` 与 `/api/devices` 使用了 [koa-queries](https://www.npmjs.com/package/koa-queries) 中间件，可以自定义过滤查询列表：

- 精确搜索：`?${key}__is=${value}` 
 - http://localhost:7001/api/devices?clientId__is=3457beb0-1e0b-11e9-a946-394b108d0c12
 
- 模糊搜索：`?${key}__like=${value}`
 - http://localhost:7001/api/devices?clientId__like=3457beb0-1e0b-11e9-a946-394b108d0c12

- 字段嵌套：`?${key.subKey.subKey}__is=${value}`
 - http://localhost:7001/api/payload?raw.cmd.status__is=0&isJSON__is=true
