import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

const useCd = (): any => {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  // 监听播放状态，当播放暂停时设置外层样式为内层图片旋转角度样式
  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  const syncTransform = (wrapper: any, inner: any) => {
    // getComputedStyle  获取dom实时样式
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    // 当外层同步过有旋转角度时，需拼接内层旋转，因为内层是相对外层旋转的
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}

export default useCd
