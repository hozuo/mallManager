import Vue from 'vue'
import Router from 'vue-router'

// import Login from '../components/login/login.vue'
// webpack中使用@会自动寻找到src文件夹
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/user/user.vue'
import Role from '@/components/power/role.vue'
import Right from '@/components/power/right.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }, {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'user',
        path: '/user',
        component: User
      }, {
        name: 'role',
        path: '/role',
        component: Role
      }, {
        name: 'right',
        path: '/right',
        component: Right
      }]
    }
  ]
})
