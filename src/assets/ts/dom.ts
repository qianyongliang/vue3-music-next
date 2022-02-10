// 往el中添加class
export const addClass = (el: HTMLElement, className: string) => {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}
// 从el中删除class
export const removeClass = (el: HTMLElement, className: string) => {
  el.classList.remove(className)
}
