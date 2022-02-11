import { ref, computed } from 'vue'

// 侧边导航栏
const useShortcut = (props: any, groupRef: any) => {
  // 获取整个滚动组件
  const scrollRef = ref<any>(null)
  // 字母高度
  const ANCHOR_HEIGHT = 18
  // 字母list
  const shortcutList = computed(() => {
    return props.data.map((item: { [key: string]: any }) => {
      return item.title
    })
  })
  // 记录滑动
  const touch = {
    y1: 0,
    y2: 0,
    anchorIndex: 0
  }
  const onShortcutTouchStart = (e: any) => {
    // 获取点击的当前字母index
    const anchorIndex = parseInt(e.target.dataset.index)
    // 记录手指触摸时位置
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }
  const onShortcutTouchMove = (e: any) => {
    touch.y2 = e.touches[0].pageY
    // 滑动距离除以字母高度向下取整，计算滑动字母个数
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    // 计算滑动到 第几个
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  const scrollTo = (index: number) => {
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const scroll = scrollRef.value.scroll
    const targetEl = groupRef.value.children[index]
    // 调用滚动方法，滚动到点击的对应字母上
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}

export default useShortcut
