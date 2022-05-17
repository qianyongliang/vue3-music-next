import { get } from './base'
import { Song } from './interface'

interface Singers {
  singers: {
    list: Song[],
    title: string
  }[]
}

// 歌手列表
export const getSingerList = (): Promise<Singers> => {
  return new Promise((resolve, reject) => {
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
export const getSingerDetail = (singer: Song): Promise<Singers> => {
  return new Promise((resolve, reject) => {
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
