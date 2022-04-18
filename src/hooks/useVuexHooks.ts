import { mapGetters, mapState, mapActions, createNamespacedHelpers } from 'vuex'
import { useStateMapper, useActionMapper } from './useMapper'

const checkType = (data: string) => {
  return Object.prototype.toString.call(data)
}

export const useState = (moduleName: string, mapper: any): any => {
  let mapperFn = mapState
  // 如果使用模块化，则使用vuex提供的createNamespacedHelpers方法找到对应模块的mapState方法
  if (checkType(moduleName) === '[object String]' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapState
  }
  return useStateMapper(mapper, mapperFn)
}
export const useGetters = (moduleName: string, mapper: any): any => {
  let mapperFn = mapGetters
  // 如果使用模块化，则使用vuex提供的createNamespacedHelpers方法找到对应模块的mapState方法
  if (checkType(moduleName) === '[object String]' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapGetters
  }
  return useStateMapper(mapper, mapperFn)
}

export const useActions = (moduleName: string, mapper: any): any => {
  let mapperFn = mapActions
  // 如果使用模块化，则使用vuex提供的createNamespacedHelpers方法找到对应模块的mapState方法
  if (checkType(moduleName) === '[object String]' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapActions
  }
  return useActionMapper(mapper, mapperFn)
}
