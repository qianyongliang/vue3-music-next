<template>
  <!-- 搜索结果列表 -->
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import { Singer, Song } from '@/service/interface'
import usePullUpLoad from './use-pull-up-load'

export default defineComponent({
  name: 'suggest',
  props: {
    query: String, // 搜索val
    showSinger: {
      // 是否显示歌手
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup (props, { emit }) {
    const songs = ref<Array<Song>>([]) // 歌曲
    const singer = ref<any>(null) // 歌手
    const hasMore = ref<boolean>(true) // 是否还有更多可搜索
    const page = ref<number>(1) // 用于搜索更多
    const loadingText = ref<string>('')
    const noResultText = ref<string>('抱歉，暂无搜索结果')
    const manualLoading = ref<boolean>(false) // 手动加载更多

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })
    // 无结果
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    // 加载中
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    // 防多次调用
    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad(
      searchMore,
      preventPullUpLoad
    )
    // 监听需要搜索的val是否改变
    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) {
          return
        }
        await searchFirst()
      }
    )

    // 搜索
    const searchFirst = async () => {
      if (!props.query) {
        return
      }
      // 首次搜索时初始化
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true
      // 搜索结果
      const result = await search(props.query, page.value, props.showSinger)
      // 处理歌曲播放url数据
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }
    // 搜索更多
    async function searchMore () {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      debugger
      await makeItScrollable()
    }

    const makeItScrollable = async () => {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }
    // 点击歌手
    const selectSinger = (singer: Singer) => {
      emit('select-singer', singer)
    }
    // 点击歌曲
    const selectSong = (song: Song) => {
      emit('select-song', song)
    }

    return {
      songs,
      singer,
      loadingText,
      pullUpLoading,
      noResultText,
      loading,
      noResult,
      selectSinger,
      selectSong,
      rootRef
    }
  }
})
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
