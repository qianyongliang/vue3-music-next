import { get } from './base'

interface IPromise {
  [key: string]: {
    [key: string]: any
  }[]
}

// 歌手列表
export const getSingerList = () :Promise<IPromise> => {
  return new Promise<IPromise>((resolve, reject) => {
    get('/api/getSingerList')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 歌手详情
export const getSingerDetail = (singer: { [key: string]: any }) => {
  return new Promise<IPromise>((resolve, reject) => {
    get('/api/getSingerDetail', {
      mid: singer.mid
    })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
