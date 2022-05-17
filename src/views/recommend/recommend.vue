<template>
  <div class="recommend" v-loading="loading">
    <Scroll class="recommend-content">
      <div>
        <!-- 轮播图 -->
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>

        <!-- 推荐 -->
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              class="item"
              v-for="item in albums"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <!-- outer-view 的 slot 固定写法， 主要使用 <transition> 和 <keep-alive> 组件来包裹你的路由组件。-->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum"></component>
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider.vue'
import Scroll from '@/components/base/scroll/scroll.vue'
import { ALBUM_KEY } from '@/assets/ts/constant'

interface Album {
  [key: string]: any
}

interface State {
  sliders: {
    [key: string]: any
  }
  albums: Album[]
  loading: boolean
  selectedAlbum: Album
}

export default defineComponent({
  name: 'recommend',
  components: {
    Slider,
    Scroll
  },
  setup () {
    const router = useRouter()
    const state = reactive({
      sliders: [],
      albums!: [],
      loading: computed((): boolean => {
        return !state.sliders.length && !state.albums.length
      }),
      selectedAlbum: {}
    }) as State

    // 获取页面数据
    const getRecommendRes = () => {
      getRecommend().then((res) => {
        state.sliders = res.sliders
        state.albums = res.albums
      })
    }
    getRecommendRes()

    // 点击歌单
    const selectItem = (album: Album) => {
      state.selectedAlbum = album
      cacheAlbum(album)
      router.push({
        path: `/recommend/${album.id}`
      })
    }

    // 缓存点击的歌单
    const cacheAlbum = (album: Album) => {
      sessionStorage.setItem(ALBUM_KEY, JSON.stringify(album))
    }

    return {
      ...toRefs(state),
      selectItem
    }
  }
})
</script>
<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
