import { get } from './base'

interface Song {
  [key: string]: string
}

// 处理歌曲播url数据
export const processSongs = (songs: Array<Song>): Promise<Array<Song>> => {
  return new Promise((resolve) => {
    if (!songs.length) {
      return resolve(songs)
    }
    get('/api/getSongsUrl', {
      mid: songs.map((song) => {
        return song.mid
      })
    }).then((result) => {
      const map = result.map
      return resolve(songs.map((song) => {
        song.url = map[song.mid]
        return song
      }).filter((song) => {
        return song.url && song.url.indexOf('vkey') > -1
      }))
    })
  })
}
