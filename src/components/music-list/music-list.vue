<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length > 0" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </Scroll>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Scroll from '@/components/wrap-scroll/index'
import SongList from '@/components/base/song-list/song-list.vue'

const RESERVED_HEIGHT = 40

export default defineComponent({
  name: 'music-list',
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    title: String,
    pic: String,
    loading: Boolean,
    rank: Boolean
  },
  setup (props) {
    const router = useRouter()
    const state = reactive({
      scrollY: 0,
      maxTranslateY: 0 // 最大偏移高度
    })
    const bgImage = ref<any>(null)
    const imageHeight = ref(0)

    onMounted(() => {
      imageHeight.value = bgImage.value.clientHeight
      state.maxTranslateY = imageHeight.value - RESERVED_HEIGHT
    })
    // 滚动样式
    const scrollStyle = computed(() => {
      return {
        top: `${imageHeight.value}px`,
        bottom: '0px'
      }
    })
    // 图片样式设置
    const bgImageStyle = computed(() => {
      const scrollY = state.scrollY
      let paddingTop = '70%'
      let height = '0'
      // translateZ 值越大，图像离你越近，值越小，图像离你越远
      let translateZ = 0
      // 图片缩放
      let scale = 1
      let zIndex = 0

      if (scrollY > state.maxTranslateY) {
        paddingTop = '0'
        // 当滚动高度大于最大偏移量时，固定图片高度为标题高度
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
        zIndex = 10
      }
      // 下拉时，根据偏移量放大图片
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / imageHeight.value)
      }
      return {
        paddingTop,
        height,
        zIndex,
        backgroundImage: `url(${props.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    })
    // 背景过滤器：毛玻璃模糊效果
    const filterStyle = computed(() => {
      const scrollY = state.scrollY
      let blur = 0
      // 当没达到最大偏移量时，使用偏移量计算，当达到或超过时，使用最大偏移量计算
      if (scrollY >= 0) {
        blur = Math.min(state.maxTranslateY / imageHeight.value, scrollY / imageHeight.value) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    })
    // 播放按钮样式
    const playBtnStyle = computed(() => {
      let display = ''
      if (state.scrollY >= state.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    })
    // 返回
    const goBack = () => {
      router.back()
    }
    // 随机播放
    const random = () => {
      console.log('随机播放')
    }
    // 滚动
    const onScroll = (pos: { x: number, y: number }) => {
      state.scrollY = -pos.y
    }
    // 点击播放歌曲
    const selectItem = ({ song, index }: { song: any, index: number }) => {
      console.log(song, index)
    }
    return {
      bgImageStyle,
      playBtnStyle,
      filterStyle,
      scrollStyle,
      goBack,
      random,
      onScroll,
      selectItem,
      bgImage
    }
  }
})
</script>
<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
