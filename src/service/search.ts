import { get } from './base'
import { Singer, Song } from '@/service/interface'

interface HotKeysRes {
  hotKeys: {
    id: number,
    key: string
  }[]
}

interface SearchRes {
  hasMore: boolean;
  singer: Singer;
  songs: Song[];
}

// 热门搜索
export const getHotKeys = (): Promise<HotKeysRes> => {
  return new Promise((resolve, reject) => {
    get('/api/getHotKeys')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 搜索
export const search = (query: string, page: number, showSinger: boolean): Promise<SearchRes> => {
  return new Promise((resolve, reject) => {
    get('/api/search', {
      query,
      page,
      showSinger
    })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
