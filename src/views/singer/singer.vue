<template>
  <div class="singer">
    <singer-list :data="singers" @select="selectSinger"></singer-list>

    <!-- outer-view 的 slot 固定写法， 主要使用 <transition> 和 <keep-alive> 组件来包裹你的路由组件。-->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import SingerList from '@/components/singer-list/singer-list'
import { getSingerList } from '@/service/singer'
import { SINGER_KEY } from '@/assets/ts/constant'

export default defineComponent({
  name: 'singer',
  components: {
    SingerList
  },
  setup () {
    const router = useRouter()
    const state = reactive({
      singers: [],
      selectedSinger: {}
    })

    // 获取歌手数据
    const getSingerListRes = () => {
      getSingerList().then((res) => {
        state.singers = res.singers
        console.log(res)
      })
    }
    getSingerListRes()

    const selectSinger = (singer) => {
      state.selectedSinger = singer
      cacheAlbum(singer)
      router.push({
        path: `/singer/${singer.mid}`
      })
    }

    // 缓存点击的歌手
    const cacheAlbum = (singer) => {
      sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer))
    }

    return {
      ...toRefs(state),
      selectSinger
    }
  }
})
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
