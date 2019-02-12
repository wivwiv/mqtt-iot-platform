'use strict'

const axios = require('axios')

module.exports = {
  emqxAPI() {
    const { mgmtBaseUrl, appId, appSecret } = this.config
    axios.baseURL = mgmtBaseUrl
    axios.defaults.auth = {
      username: appId,
      password: appSecret,
    }
    return axios
  },
}
