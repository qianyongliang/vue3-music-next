import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 推荐
const Recommend = () =>
  import(/* webpackChunkName: "recommend" */ '../views/recommend/recommend.vue')
// 歌手
const Singer = () =>
  import(/* webpackChunkName: "singer" */ '../views/singer/singer.vue')
// 排行
const TopList = () =>
  import(/* webpackChunkName: "top-list" */ '../views/topList/top-list.vue')
// 搜索
const Search = () =>
  import(/* webpackChunkName: "search" */ '../views/search/search.vue')
// 个人中心
const User = () =>
  import(
    /* webpackChunkName: "user-center" */ '../views/userCenter/user-center.vue'
  )
// 推荐歌单详情
const Album = () =>
  import(/* webpackChunkName: "album" */ '@/views/album/album.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: TopList
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/user',
    name: 'User',
    component: User
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
