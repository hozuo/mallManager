import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment'

// 导入插件模块
import '@/plugins/element.js'
import '@/plugins/http.js'

// 导入全局依赖
import Qs from 'qs'

// 导入样式
import '@/assets/css/reset.css'

Vue.config.productionTip = false

// 声明全局变量
Vue.prototype.$Qs = Qs

// 全局过滤器
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
