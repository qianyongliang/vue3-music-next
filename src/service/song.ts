import { get } from './base'
import { Song } from './interface'

// 处理歌曲播url数据
export const processSongs = (songs: Song[]): Promise<Song[]> => {
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

// 获取歌词
const lyricMap: any = {}
export const getLyric = (song: Song): Promise<string> => {
  return new Promise((resolve) => {
    // 如果缓存过歌词，直接返回
    if (song.lyric) {
      return resolve(song.lyric)
    }
    const mid = song.mid
    const lyric = lyricMap[mid]
    if (lyric) {
      return resolve(lyric)
    }
    get('/api/getLyric', {
      mid
    }).then((result) => {
      const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
      lyricMap[mid] = lyric
      return resolve(lyric)
    })
  })
}
