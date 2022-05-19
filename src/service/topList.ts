import { get } from './base'
import { TopListItem, Song } from './interface'

interface TopListRes {
  topList: TopListItem[]
}
interface TopListDetail {
  songs: Song[]
}

// 获取榜单列表
export const getTopList = (): Promise<TopListRes> => {
  return new Promise((resolve, reject) => {
    get('/api/getTopList')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 榜单详情
export const getTopDetail = (top: TopListItem): Promise<TopListDetail> => {
  return new Promise((resolve, reject) => {
    get('/api/getTopDetail', {
      id: top.id,
      period: top.period
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
