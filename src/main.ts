import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 图片懒加载
import lazyPlugin from 'vue3-lazy'
// 自定义指令
import loadingDirective from '@/components/base/loading/directive'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/images/default.png')
  })
  .directive('loading', loadingDirective)
  .mount('#app')
