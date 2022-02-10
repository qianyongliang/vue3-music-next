import { get } from './base'

interface Singer {
  [key: string]: {
    [key: string]: any
  }[]
}

// 推荐数据
export const getSingerList = () => {
  return new Promise<Singer>((resolve, reject) => {
    get('/api/getSingerList')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
