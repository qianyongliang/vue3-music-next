<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  toRefs,
  ref,
  watch,
  nextTick
} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getHotKeys } from '@/service/search'
import useSearchHistory from '@/components/search/use-search-history'
import { Song, Singer } from '@/service/interface'
import { SINGER_KEY } from '@/assets/ts/constant'
import { cache } from '@/assets/ts/array-store'
import SearchInput from '@/components/search/search-input.vue'
import SearchList from '@/components/base/search-list/search-list.vue'
import Confirm from '@/components/base/confirm/confirm.vue'
import Scroll from '@/components/wrap-scroll'
import Suggest from '@/components/search/suggest.vue'
interface State {
  hotKeys: {
    [key: string]: any
  }
  query: string
}

export default defineComponent({
  name: 'search',
  components: {
    SearchInput,
    SearchList,
    Confirm,
    Scroll,
    Suggest
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const searchHistory = computed(() => store.state.searchHistory)

    const state = reactive({
      hotKeys: [],
      query: ''
    }) as State

    const scrollRef = ref<any>(null)
    const confirmRef = ref<any>(null)
    const selectedSinger = ref<any>(null)
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    // 热门搜索
    const getHotKeysApi = async () => {
      const result = await getHotKeys()
      state.hotKeys = result?.hotKeys
    }
    getHotKeysApi()

    watch(
      () => state.query,
      async (newQuery) => {
        if (!newQuery) {
          await nextTick()
          refreshScroll()
        }
      }
    )

    const refreshScroll = () => {
      scrollRef.value.scroll.refresh()
    }
    // 点击标签查询
    const addQuery = (val: string) => {
      state.query = val
    }
    // 点击歌曲
    const selectSong = (song: Song) => {
      saveSearch(state.query)
      // store.dispatch('addSong', song)
    }
    // 点击歌手
    const selectSinger = (singer: Singer) => {
      saveSearch(state.query)
      selectedSinger.value = singer
      cache(SINGER_KEY, singer)

      router.push({
        path: `/search/${singer.mid}`
      })
    }
    // 弹窗提示
    const showConfirm = () => {
      confirmRef.value.show()
    }

    return {
      ...toRefs(state),
      searchHistory,
      scrollRef,
      confirmRef,
      selectedSinger,
      addQuery,
      showConfirm,
      deleteSearch,
      clearSearch,
      selectSong,
      selectSinger
    }
  }
})
</script>
<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
