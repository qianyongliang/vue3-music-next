import storage from 'good-storage'

interface Arr {
  [key: string]: any
}
interface Compare {
  (key: any): boolean
}

// 缓存到 location 中
const inertArray = (arr: Arr, val: any, compare: Compare, maxLen: number) => {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

const deleteFromArray = (arr: Arr, compare: Compare) => {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export const save = (item: any, key: string, compare: Compare, maxLen: number) => {
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export const remove = (key: string, compare: Compare) => {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export const load = (key: string) => {
  return storage.get(key, [])
}

export const clear = (key: string) => {
  storage.remove(key)
  return []
}

export const saveAll = (items: any, key: string) => {
  storage.set(key, items)
}

// 缓存到session中
export const cache = (name: string, val: any) => {
  storage.session.set(name, val)
}
