// 对 Scroll 组件的扩展
import { h, mergeProps, renderSlot, withCtx, ref, computed } from 'vue'
import Scroll from '@/components/base/scroll/scroll.vue'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render (ctx: any) {
    // mergeProps将包含 VNode prop 的多个对象合并为一个单独的对象。其返回的是一个新创建的对象，而作为参数传递的对象则不会被修改
    return h(
      Scroll,
      mergeProps(
        {
          ref: 'scrollRef'
        },
        ctx.$props, // 添加方法，props 本来就是一个对象，所以不用大括号括起来
        {
          onScroll: (pos: { x: number; y: number }) => {
            // 创建监听函数，监听滚动事件
            ctx.$emit('scroll', pos)
          }
        }
      ),
      {
        default: withCtx(() => {
          // 此处用法暂未明白，看视频了解详情后补充
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup () {
    const scrollRef = ref<any>(null)
    const scroll = computed(() => {
      return scrollRef.value.scroll
    })

    return {
      scrollRef,
      scroll
    }
  }
}
