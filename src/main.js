import Vue from 'vue'
import App from './App'
import router from './router'

// 导入自定义组件
import MyBread from '@/components/custom/myBread.vue'

// 导入插件模块
import '@/plugins/element.js'
import '@/plugins/http.js'

// 导入全局依赖

import moment from 'moment'

// 导入样式
import '@/assets/css/reset.css'

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})

Vue.filter('money', (v) => {
  return v / 100
})

// 声明全局组件
Vue.component('my-bread', MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
