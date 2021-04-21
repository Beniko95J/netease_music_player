import Vue from 'vue'
import VueRouter from 'vue-router'
import MusicContent from '../components/MusicContent'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: MusicContent
  }
]

const router = new VueRouter({
  routes
})

export default router
