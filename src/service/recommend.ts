import { get } from './base'

interface IPromise {
  [key: string]: {
    [key: string]: any
  }[]
}

// 推荐数据
export const getRecommend = () => {
  return new Promise<IPromise>((resolve, reject) => {
    get('/api/getRecommend')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 歌单详情数据
export const getAlbum = (album: { [key: string]: any }) => {
  return new Promise<IPromise>((resolve, reject) => {
    get('/api/getAlbum', {
      id: album.id
    })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
