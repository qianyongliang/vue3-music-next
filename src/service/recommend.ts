import { get } from './base'
import { Album, Sliders, Song } from './interface'
interface Recommend {
  albums: Album[];
  sliders: Sliders[];
}

interface AlbumDetail {
  songs: Song[];
}

// 推荐数据
export const getRecommend = (): Promise<Recommend> => {
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

// 歌单详情数据
export const getAlbum = (album: Album): Promise<AlbumDetail> => {
  return new Promise((resolve, reject) => {
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
