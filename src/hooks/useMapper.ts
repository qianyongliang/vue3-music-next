import { useStore } from 'vuex'
import { computed } from 'vue'

export const useStateMapper = (mapper: any, mapFn: any) => {
  const store = useStore()

  const storeStateFns = mapFn(mapper)

  const storeState: { [key: string]: any } = {}
  Object.keys(storeStateFns).forEach(fnKey => {
    // vuex源码中mapState和mapGetters的方法中使用的是this.$store,所以更改this绑定
    const fn = storeStateFns[fnKey].bind({ $store: store })
    storeState[fnKey] = computed(fn)
  })

  return storeState
}

export const useActionMapper = (mapper: any, mapFn: any) => {
  const store = useStore()

  const storeActionsFns = mapFn(mapper)

  const storeAction: { [key: string]: any } = {}

  Object.keys(storeActionsFns).forEach(fnKey => {
    storeAction[fnKey] = storeActionsFns[fnKey].bind({ $store: store })
  })

  return storeAction
}
