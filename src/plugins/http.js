// axios插件模块
import Vue from 'vue'
import Qs from 'qs'

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  // 添加实例方法
  Vue.prototype.$http = axios
  // axios.defaults.baseURL = 'http://api.ericson.top/api/private/v1'
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    console.log('请求拦截器')
    console.log(config)
    console.log(config.url)
    // 数据处理
    config.transformRequest = [
      data => {
        return Qs.stringify(data)
      }
    ]
    // 添加token
    if (config.url === 'http://api.ericson.top:2020/user/login') {
      // 登录请求直接通过
      return config
    } else {
      // 其他请求添加请求头
      config.headers['token'] = localStorage.getItem('token')
      return config
    }
  }, function (error) {
    // 对请求错误做些什么
    console.log('error:' + error)
    return Promise.reject(error)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log('响应拦截器')
    return response
  }, function (error) {
    // 对响应错误做点什么
    console.log('error:' + error)
    return Promise.reject(error)
  })
}

Vue.use(MyHttpServer)
