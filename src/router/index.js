import Vue from 'vue'
import Router from 'vue-router'

// import Login from '../components/login/login.vue'
// webpack中使用@会自动寻找到src文件夹
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/user/user.vue'

import Role from '@/components/power/role.vue'
import Menu from '@/components/power/menu.vue'

import Cat from '@/components/data/cat.vue'
import Store from '@/components/data/store.vue'
import Item from '@/components/data/item.vue'

import Instock from '@/components/stock/instock.vue'
import Stock from '@/components/stock/stock.vue'

import { Message } from 'element-ui'

Vue.use(Router)

var router = new Router({
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
        name: 'menu',
        path: '/menu',
        component: Menu
      }, {
        name: 'cat',
        path: '/cat',
        component: Cat
      }, {
        name: 'store',
        path: '/store',
        component: Store
      }, {
        name: 'item',
        path: '/item',
        component: Item
      }, {
        name: 'instock',
        path: '/instock',
        component: Instock
      }, {
        name: 'stock',
        path: '/stock',
        component: Stock
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  const token = localStorage.getItem('token')
  if (!token) {
    Message.warning('用户未登录')
    router.push({ name: 'login' })
  }
  next()
})

export default router
