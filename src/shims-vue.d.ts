/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * 当 import 一个没有类型声明的第三方库时，TypeScript 不知道 import 进来的东西是什么类型，
 * 只能偷偷地把它指定成 any 类型，这也就是我们常说的隐式 any（implicit any）。
 * 所有正常的前端项目都会禁止 implicit any 出现，所以就报错了
 * 只需要在 TypeScript 的 .d.ts 文件中编写一个空的 declare module，就能把环境包当作 any 类型引入，
 * 同时又不会触发 implicit any 报错。这个操作被文档叫做 Shorthand ambient modules，意为「快速引入环境包」：
 */
declare module 'good-storage'