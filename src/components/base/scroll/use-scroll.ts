import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)

interface Options {
  click: boolean
  probeType: number
}
export const useScroll = (
  wrapperRef: any,
  options: Options,
  emit: any
) => {
  const scroll = ref<any>(null)

  // 初始化
  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    }))

    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos: { x: number; y: number }) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
