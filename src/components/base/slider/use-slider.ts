import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export const useSlider = (wrapperRef: any) => {
  const currentPageIndex = ref(0)
  const slider = ref<any>(null)
  // 初始化
  onMounted(() => {
    const slideVal = (slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    }))
    slideVal.on('slideWillChange', (page: any) => {
      currentPageIndex.value = page.pageX
    })
  })
  // 卸载
  onUnmounted(() => {
    slider.value.destroy()
  })

  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    currentPageIndex
  }
}
