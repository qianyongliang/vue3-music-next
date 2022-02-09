import { get } from './base'

// 推荐数据
export const getRecommend = () => {
  return new Promise((resolve, reject) => {
    get('/api/getRecommend')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
