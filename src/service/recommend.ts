import { get } from './base'

interface Recommend {
  [key: string]: {
    [key: string]: any
  }[]
}

// 推荐数据
export const getRecommend = () => {
  return new Promise<Recommend>((resolve, reject) => {
    get('/api/getRecommend')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
