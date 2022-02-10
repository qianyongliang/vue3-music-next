import { createApp } from 'vue'
import { addClass, removeClass } from './dom'
/*
  因为 loading组件定位为 absolute ，需要根据父元素定位，
  所以当父元素没有定位属性时添加 g-relative 类，添加 relative 属性
*/
const relativeCls = 'g-relative'

const createLoadingLikeDirective = (Comp: any) => {
  // 挂载到dom实例
  const append = (el: HTMLElement | any) => {
    const name = Comp.name
    // getComputedStyle 自带属性
    const style = getComputedStyle(el)
    // 当前el 没有定位属性，则添加class
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }
  // 卸载
  const remove = (el: HTMLElement | any) => {
    const name = Comp.name
    // 卸载时删除该class
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }

  return {
    mounted (el: HTMLElement | any, binding: any) {
      const app = createApp(Comp)
      // 动态创建挂载实例， 挂载到el,也就是使用这个自定义指令的dom上，相当于在这个div里创建了一个loading的div
      const instance = app.mount(document.createElement('div'))
      const name = Comp.name

      // 创建一个字段存储创建的实例
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }

      // 值为true 时，挂载到dom上
      if (binding.value) {
        append(el)
      }
    },
    updated (el: HTMLElement | any, binding: any) {
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      // 更新时判断是挂载还是卸载
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}

export default createLoadingLikeDirective
