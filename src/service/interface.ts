// 专辑
export interface Album {
  id: number
  pic: string
  title: string
  username: string
}

// 轮播图
export interface Sliders {
  id: number
  link: string
  pic: string
}

// 歌曲
export interface Song {
  album?: string
  duration?: number
  id: number
  mid: string
  name: string
  pic: string
  singer?: string
  url?: string
  lyric?: string
}

// 歌手
export interface Singer {
  id: number
  mid: string
  name: string
  pic: string
}

// 上榜歌曲
export interface TopSong {
  id: number
  singerName: string
  songName: string
}
// 榜单
export interface TopListItem {
  id: number
  name: string
  period: string
  pic: string
  songList: TopSong[]
}
