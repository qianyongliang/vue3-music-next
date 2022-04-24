<template>
  <div class="progress-bar" @click="onClick" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progressRef" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'

// 进度条圆点宽度
const progressBtnWidth = 16

export default defineComponent({
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progress-changing', 'progress-changed'],
  setup (props, { emit }) {
    // 进度条偏移量
    const offset = ref<number>(0)
    const progressBar = ref<any>(null)
    const progressRef = ref<any>(null)
    // 已播放进度条样式
    const progressStyle = computed(() => `width:${offset.value}px`)
    // 播放圆点偏移量
    const btnStyle = computed(
      () => `transform:translate3d(${offset.value}px,0,0)`
    )
    const touch = ref<any>({})

    // 监听当前播放占总时长比
    watch(
      () => props.progress,
      (newProgress) => {
        // 进度条不含圆点总宽度
        const barWidth = progressBar.value.clientWidth - progressBtnWidth
        // 更新进度条偏移量
        offset.value = barWidth * newProgress
      }
    )

    // 滑动进度条
    const onTouchStart = (e: any) => {
      // 记录滑动开始的横坐标
      touch.value.x1 = e.touches[0].pageX
      // 记录开始时已播放的进度条宽度
      touch.value.beginWidth = progressRef.value.clientWidth
    }
    const onTouchMove = (e: any) => {
      // 滑动的偏移量
      const delta = e.touches[0].pageX - touch.value.x1
      // 滑动过程中，已播放进度条的实时宽度: 开始位置 + 偏移量
      const tempWidth = touch.value.beginWidth + delta
      // 进度条不含圆点总宽度
      const barWidth = progressBar.value.clientWidth - progressBtnWidth
      // 滑动后进度条占总长度百分百，在1-0之间
      const progress = tempWidth / barWidth
      // 更新进度条偏移量
      offset.value = barWidth * progress
      // 抛出，用来改变播放组件的时间
      emit('progress-changing', progress)
    }
    const onTouchEnd = () => {
      // 进度条不含圆点总宽度
      const barWidth = progressBar.value.clientWidth - progressBtnWidth
      // 滑动后进度条占总长度百分百，在1-0之间
      const progress = progressRef.value.clientWidth / barWidth
      emit('progress-changed', progress)
    }
    // 点击改变播放位置
    const onClick = (e: any) => {
      // getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
      const rect = progressBar.value.getBoundingClientRect()
      // 点击位置进度条长度 = 进度条点击的位置横坐标 - 进度条的left值
      const offsetWidth = e.pageX - rect.left
      const barWidth = progressBar.value.clientWidth - progressBtnWidth
      const progress = offsetWidth / barWidth
      emit('progress-changed', progress)
    }
    return {
      progressBar,
      progressRef,
      progressStyle,
      btnStyle,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick
    }
  }
})
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
