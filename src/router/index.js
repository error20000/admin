import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Index from '@/views/Index.vue'

Vue.use(VueRouter)

const page = name => () => import('@/views/'+ name);

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    component: Index
  },
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [
      {
        path: '/test',
        component: page('Test')
      }
    ]
  }
]


const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
