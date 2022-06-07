import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 图片懒加载
import lazyPlugin from 'vue3-lazy'
// 自定义指令
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'

import { FAVORITE_KEY, PLAY_KEY } from '@/assets/ts/constant'
import { load, saveAll } from '@/assets/ts/array-store'
import { processSongs } from '@/service/song'
import * as types from '@/store/mutations-type'

// 引入全局样式文件
import '@/assets/scss/index.scss'

// 取出缓存中收藏的歌曲数据，重新获取播放地址
const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit(types.SET_FAVORITE_LIST, songs)
    saveAll(songs, FAVORITE_KEY)
  })
}

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/images/default.png')
  })
  .directive('loading', loadingDirective)
  .directive('no-result', noResultDirective)
  .mount('#app')
