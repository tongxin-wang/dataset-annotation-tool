import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Check from '../views/Check.vue'
import Wsdemo from '../views/Wsdemo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/check',
    name: 'Check',
    component: Check
  },
  {
    path: '/wsdemo',
    name: 'Wsdemo',
    component: Wsdemo
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
