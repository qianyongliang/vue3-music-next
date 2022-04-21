import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/ts/constant'
import { useActions, useState } from '@/hooks/useVuexHooks'

const useMode = (): any => {
  const { playMode } = useState('', ['playMode'])

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
        ? 'icon-random'
        : 'icon-loop'
  })
  // 不能放在函数中声明，否则useStore 值为undefined
  const action = useActions('', ['changeMode'])
  const changeMode = () => {
    const mode = (playMode.value + 1) % 3
    action.changeMode(mode)
  }

  return {
    modeIcon,
    changeMode
  }
}

export default useMode
