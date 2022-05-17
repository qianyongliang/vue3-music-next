import { ref } from 'vue'

const useMiddleInteractive = (): any => {
  const currentShow = ref<string>('cd')
  const middleLStyle = ref<any>(null)
  const middleRStyle = ref<any>(null)

  const touch: any = {}
  let currentView = 'cd'
  // 滑动开始
  const onMiddleTouchStart = (e: any) => {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }
  // 滑动中
  const onMiddleTouchMove = (e: any) => {
    // 滑动距离
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    // 取绝对值
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 方向锁
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    console.log(absDeltaX, absDeltaY, touch.directionLocked)

    if (touch.directionLocked === 'v') {
      return
    }

    // 如果是cd，则表示距离左边为0，只能往右边滑，lyric表示距离左边有一个屏幕的宽度，只能往左滑
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // 偏移量在0 到 屏幕宽度之间
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // 计算偏移占比
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    // cd 偏移超过20%则算切换了， lyric占比小于80%则算滑动了
    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }
    // 设置滑动样式：透明、偏移
    middleLStyle.value = {
      opacity: 1 - touch.percent
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }
  // 滑动结束
  const onMiddleTouchEnd = (e: any) => {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }
    // 设置样式
    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}

export default useMiddleInteractive
