// axios插件模块
import Vue from 'vue'

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  // 添加实例方法
  Vue.prototype.$http = axios
}

Vue.use(MyHttpServer)
