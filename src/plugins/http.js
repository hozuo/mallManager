// axios插件模块
import Vue from 'vue'

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  // 添加实例方法
  Vue.prototype.$http = axios
  // axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
  // axios.defaults.baseURL = 'http://api.ericson.top'
}

Vue.use(MyHttpServer)
