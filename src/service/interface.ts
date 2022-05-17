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
