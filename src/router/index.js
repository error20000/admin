import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Index from '@/views/Index.vue'
import Layout from '@/views/layout/Layout.vue'

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
    path: '/layout',
    name: 'layout',
    component: Layout
  },
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [
      {
        path: '/test',
        component: page('Test')
      },{
        path: '/user',
        component: page('User')
      },
    ]
  },
  //test
  {
    path: '/test2',
    name: 'test',
    component: page('Test')
  },
  {
    path: '/index2',
    name: 'index2',
    component: page('Index2')
  },
  {
    path: '/layout2',
    name: 'layout',
    component: page('layout/Layout')
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
