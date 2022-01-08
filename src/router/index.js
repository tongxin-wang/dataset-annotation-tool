import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Check from '../views/Check.vue'
import Wsdemo from '../views/Wsdemo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      login: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/check',
    name: 'Check',
    component: Check,
    meta: {
      login: true
    }
  },
  {
    path: '/wsdemo',
    name: 'Wsdemo',
    component: Wsdemo,
    meta: {
      login: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const name = localStorage.getItem('name')
  if (name === null && to.meta.login) {
    next({
      name: 'Login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
})

export default router
