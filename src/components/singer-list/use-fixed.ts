import { ref, watch, nextTick, computed } from 'vue'
// 歌手列表滚动
const useFixed = (props: any) => {
  // 字母栏高度
  const TITLE_HEIGHT = 30

  const groupRef = ref<any>(null)
  // 当前滚动位置
  const scrollY = ref(0)
  // 固定栏字母
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    return props.data[currentIndex.value]?.title || ''
  })
  // 字母重叠时的平移效果
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = distanceVal < TITLE_HEIGHT ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })
  // 每个字母所在高度
  const listHeights = ref<Array<number>>([])
  const currentIndex = ref(0)
  const distance = ref(0)

  // 数据获取到等dom更新完时计算高度
  watch(
    () => props.data,
    async () => {
      await nextTick()
      calculate()
    }
  )

  // 监听当前滚动位置判断当前所处哪个字母
  watch(
    () => scrollY.value,
    (newVal) => {
      const listHeightsVal = listHeights.value
      // 滚动到顶部
      if (newVal < 0) {
        currentIndex.value = 0
        return
      }
      // 滚动到底部
      if (newVal > listHeightsVal[listHeightsVal.length - 2]) {
        currentIndex.value = listHeightsVal.length - 2
        return
      }
      // 在中间滚动
      for (let i = 0; i < listHeightsVal.length - 1; i++) {
        const heightTop = listHeightsVal[i]
        const heightBottom = listHeightsVal[i + 1]
        if (newVal >= heightTop && newVal <= heightBottom) {
          currentIndex.value = i
          distance.value = heightBottom - newVal
        }
      }
    }
  )

  // 计算每个字母所属div高度
  const calculate = () => {
    listHeights.value = []
    const groupRefArr = groupRef.value.children
    let height = 0

    listHeights.value.push(height)
    for (let i = 0; i < groupRefArr.length; i++) {
      height += groupRefArr[i].clientHeight
      listHeights.value.push(height)
    }
  }
  // 监听滚动
  const onScroll = (pos: { [key: string]: number }) => {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    fixedTitle,
    fixedStyle,
    currentIndex,
    onScroll
  }
}

export default useFixed
