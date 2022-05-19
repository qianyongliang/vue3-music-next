<template>
  <div class="singer" v-loading="!singers.length">
    <singer-list :data="singers" @select="selectSinger"></singer-list>

    <!-- router-view 的 slot 固定写法， 主要使用 <transition> 和 <keep-alive> 组件来包裹你的路由组件。-->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { getSingerList } from '@/service/singer'
import { SINGER_KEY } from '@/assets/ts/constant'
import { cache } from '@/assets/ts/array-store'
import { Singer } from '@/service/interface'
import SingerList from '@/components/singer-list/singer-list.vue'

interface SingerItem {
  [key: string]: any
}

interface State {
  singers: SingerItem[];
  selectedSinger: SingerItem;
}

export default defineComponent({
  name: 'singer',
  components: {
    SingerList
  },
  setup () {
    debugger
    const router = useRouter()
    const state = reactive({
      singers: [],
      selectedSinger: {}
    }) as State

    // 获取歌手数据
    const getSingerListRes = () => {
      getSingerList().then((res) => {
        state.singers = res.singers
      })
    }
    getSingerListRes()

    const selectSinger = (singer: Singer) => {
      state.selectedSinger = singer
      // 缓存点击的歌手
      cache(SINGER_KEY, singer)
      router.push({
        path: `/singer/${singer.mid}`
      })
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
