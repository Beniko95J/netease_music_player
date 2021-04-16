import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main'
import SongBrowser from '../views/SongBrowser'
import FavouriteSongList from '../views/FavouriteSongList'
import MusicContent from '../components/MusicContent'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {path: '/song/search', component: SongBrowser},
      {path: '/song/list', component: FavouriteSongList}
    ]
  },
  {
    path: '/test',
    component: MusicContent
  }
]

const router = new VueRouter({
  routes
})

export default router
