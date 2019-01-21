# egg-iot-with-mqtt

egg.js 开发基于 MQTT 协议的 iot 应用，借助 EMQ X MQTT Broker 可进行 WebSocket、MQTT 等多种协议接入通信，实现网页聊天室、IM 通信、物联网硬件开发等功能。

本应用仅做示例演示，实现了简单的设备管理、接入 EMQ X 认证、消息持久化存储与管理。

### EMQ X 安装配置

[EMQ X 下载](http://emqtt.com/downloads) 建议下载 3.0 版本。

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


启动 EMQ X：
```
./bin/emqx start
```

启动 HTTP 认证插件：
```
./bin/emqx_ctl plugins load emqx_auth_http
```

简单管理：
访问 http://127.0.0.1:18083 EMQ X 管理控制台。


### 启动配置

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
  topic: '$queue/#', // 订阅主题
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
