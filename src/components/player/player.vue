<template>
  <div class="player" v-show="playlist.length">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <!-- 歌曲名 -->
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <!-- cd旋转、歌词 -->
      <div
        class="middle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd"
      >
        <div class="middle-l" :style="middleLStyle">
          <div ref="cdWrapperRef" class="cd-wrapper">
            <div ref="cdRef" class="cd">
              <img
                ref="cdImageRef"
                class="image"
                :class="cdCls"
                :src="currentSong.pic"
              />
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                :class="{ current: currentLineNum === index }"
                v-for="(line, index) in currentLyric.lines"
                :key="line.num"
              >
                {{ line.txt }}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </div>
        </scroll>
      </div>
      <!-- 播放块按钮、进度条相关 -->
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
          <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
        </div>
        <!-- 进度条 -->
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              ref="barRef"
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            ></progress-bar>
          </div>
          <span class="time time-r">{{
            formatTime(currentSong.duration)
          }}</span>
        </div>
        <!-- 播放按钮 -->
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i
              @click="toggleFavorite(currentSong)"
              :class="getFavoriteIcon(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useState } from '@/hooks/useVuexHooks'
import * as types from '@/store/mutations-type'
import { formatTime } from '@/assets/ts/util'
import { PLAY_MODE } from '@/assets/ts/constant'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import useMiddleInteractive from './use-middle-interactive'
import useCd from './use-cd'
import useLyric from './use-lyric'
import ProgressBar from './progress-bar.vue'
import Scroll from '@/components/base/scroll/scroll.vue'

export default defineComponent({
  name: 'player',
  components: {
    ProgressBar,
    Scroll
  },
  setup () {
    // data
    const audioRef = ref<any>(null)
    const currentTime = ref<number>(0)
    const songReady = ref<boolean>(false) // 是否准备好播放
    const progressChanging = ref<boolean>(false) // 是否在拖动进度条中

    // vuex ----------------------------------------------------------
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)
    const { fullScreen, playing, currentIndex, playlist, playMode } = useState(
      '',
      ['fullScreen', 'playing', 'currentIndex', 'playlist', 'playMode']
    )

    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playLyric,
      playingLyric,
      stopLyric
    } = useLyric({
      songReady,
      currentTime
    })
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useMiddleInteractive()

    // computed --------------------------------------------------------
    // 设置播放按钮样式
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    // 播放未准备样式
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })
    // 播放时间占总时长比
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration || 0
    })

    // watch  ----------------------------------------------------------
    // 监听歌曲切换，使用对应url播放
    watch(currentSong, (newSong) => {
      if (!newSong.url || !newSong.id) {
        return
      }
      // 切换歌曲重新计时
      currentTime.value = 0
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      // 调用播放方法
      audioEl.play()
      store.commit(types.SET_PLAYING_STATE, true)
    })
    // 监听播放暂停
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })

    // methds ---------------------------------------------------------
    // 取消全屏
    const goBack = () => {
      store.commit(types.SET_FULL_SCREEN, false)
    }
    // 切换播放暂停状态
    const togglePlay = () => {
      if (!songReady.value) {
        return
      }
      store.commit(types.SET_PLAYING_STATE, !playing.value)
    }
    // 在非交互情况下暂停播放，需处理，不然数据没暂停（歌词，进度条等），如合上电脑待机状态
    const pause = () => {
      store.commit(types.SET_PLAYING_STATE, false)
    }
    // 切换到上一首
    const prev = () => {
      const list = playlist.value
      if (!songReady.value || !list.length) {
        return
      }
      // 列表里只有一首歌
      if (list?.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        // 当前已是第一首，则切换到最后一首
        if (index === -1) {
          index = list.length - 1
        }
        store.commit(types.SET_CURRENT_INDEX, index)
      }
    }
    // 切换到下一首
    const next = () => {
      const list = playlist.value
      if (!songReady.value || !list.length) {
        return
      }
      // 列表里只有一首歌
      if (list?.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        // 当前已是最后一首，则切换到第一首
        if (index === list.length) {
          index = 0
        }
        store.commit(types.SET_CURRENT_INDEX, index)
      }
    }
    // 循环loop
    const loop = () => {
      const audioEl = audioRef.value
      // 重头开始播放
      audioEl.currentTime = 0
      audioEl.play()
      store.commit(types.SET_PLAYING_STATE, true)
    }
    // canplay：浏览器能够开始播放音频时触发
    const ready = () => {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
    }
    const error = () => {
      songReady.value = true
    }
    // 音频currentTime改变时触发
    const updateTime = (e: any) => {
      // 如果在拖动进度条，就不改变当前播放时间，拖动优先
      if (!progressChanging.value) {
        currentTime.value = e.target.currentTime
      }
    }
    // 拖动进度条中
    const onProgressChanging = (progress: number) => {
      progressChanging.value = true
      currentTime.value = currentSong.value.duration * progress
      // 拖动进度条的时候先同步歌词进度，再暂停播放歌词
      playLyric()
      stopLyric()
    }
    // 拖动进度条结束
    const onProgressChanged = (progress: number) => {
      progressChanging.value = false
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress
      if (!playing.value) {
        store.commit(types.SET_PLAYING_STATE, true)
      }
      // 拖动结束后再同步一次，并播放
      playLyric()
    }
    // 播放结束
    const end = () => {
      // 一首歌曲播放结束后，根据当前播放模式，播放下一首
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    return {
      // data
      audioRef,
      formatTime,
      currentTime,
      playlist,

      // vuex
      fullScreen,
      currentSong,

      // computed
      playIcon,
      disableCls,
      progress,

      // methds
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      updateTime,
      onProgressChanging,
      onProgressChanged,
      end,
      // hooks -----------------
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      // lyric
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      // use-middle-interactive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    }
  }
})
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
