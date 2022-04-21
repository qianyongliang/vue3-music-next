// 生成一个小于等于指定数的随机整数
const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * (max + 1))
}

// 调换位置
const swap = (arr: Array<any>, i: number, j: number) => {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

// 将数组乱序洗牌：循环，将每一项随机跟他位置前面的某一项交换
export const shuffle = (source: Array<any>) => {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

// 格式化时间
export const formatTime = (interval: number): string => {
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
