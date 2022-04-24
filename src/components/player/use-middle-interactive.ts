import { ref } from 'vue'

const useMiddleInteractive = (): any => {
  const currentShow = ref<string>('cd')
  return {
    currentShow
  }
}

export default useMiddleInteractive
