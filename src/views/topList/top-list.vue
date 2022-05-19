<template>
  <div class="top-list" v-loading="loading">
    <scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="item in topList"
          :key="item.id"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.pic" />
          </div>
          <ul class="song-list">
            <li
              class="song"
              v-for="(song, index) in item.songList"
              :key="song.id"
            >
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getTopList } from '@/service/topList'
import { TopSong } from '@/service/interface'
import { TOP_KEY } from '@/assets/ts/constant'
import { cache } from '@/assets/ts/array-store'
import Scroll from '@/components/base/scroll/scroll.vue'

export default defineComponent({
  name: 'top-list',
  components: {
    Scroll
  },
  setup () {
    const router = useRouter()
    const loading = ref<boolean>(true)
    const topList = ref<any>([])
    const selectedTop = ref<any>({})

    // 查询榜单
    const getTopListRes = async () => {
      const result = await getTopList()
      topList.value = result.topList
      loading.value = false
    }
    getTopListRes()

    // 点击榜单
    const selectItem = (top: TopSong) => {
      selectedTop.value = top
      // 缓存点击的榜单
      cache(TOP_KEY, top)
      router.push({
        path: `/top-list/${top.id}`
      })
    }

    return {
      loading,
      topList,
      selectedTop,
      selectItem
    }
  }
})
</script>
<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
