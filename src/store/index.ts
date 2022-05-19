import { createStore } from 'vuex'
import * as types from './mutations-type'
import { PLAY_MODE, SEARCH_KEY } from '@/assets/ts/constant'
import { shuffle } from '@/assets/ts/util'
import { Song } from '@/service/interface'
import { load } from '@/assets/ts/array-store'

interface State {
  fullScreen: boolean;
  playlist: Song[];
  currentIndex: number;
  playing: boolean;
  playMode: number;
  sequenceList: Song[];
  favoriteList: Song[];

}

export default createStore({
  state: <State> {
    // 播放器页面是否全屏
    fullScreen: false,
    // 当前播放歌曲列表
    playlist: [],
    // 当前播放歌曲index
    currentIndex: 0,
    // 播放状态
    playing: false,
    // 播放模式
    playMode: PLAY_MODE.sequence,
    // 顺序播放列表，记录原始播放顺序，避免在随机播放后打乱原来播放列表
    sequenceList: [],
    // 收藏列表
    favoriteList: [],
    // 搜索历史
    searchHistory: load(SEARCH_KEY)
  },
  getters: {
    // 当前播放歌曲
    currentSong: state => state.playlist[state.currentIndex] || {}
  },
  mutations: {
    [types.SET_FULL_SCREEN] (state, fullScreen) {
      state.fullScreen = fullScreen
    },
    [types.SET_PLAY_LIST] (state, playlist) {
      state.playlist = playlist
    },
    [types.SET_CURRENT_INDEX] (state, index) {
      state.currentIndex = index
    },
    [types.SET_PLAYING_STATE] (state, playing) {
      state.playing = playing
    },
    [types.SET_PLAY_MODE] (state, mode) {
      state.playMode = mode
    },
    [types.SET_SEQUENCE_LIST] (state, sequenceList) {
      state.sequenceList = sequenceList
    },
    [types.SET_FAVORITE_LIST] (state, favoriteList) {
      state.favoriteList = favoriteList
    },
    [types.SET_SONG_LYRIC] (state, { song, lyric }) {
      state.sequenceList.map((item) => {
        if (item.mid === song.mid) {
          item.lyric = lyric
        }
        return item
      })
    }
  },
  actions: {
    // 播放
    selectPlay ({ commit }, { list, index }) {
      commit(types.SET_PLAY_MODE, PLAY_MODE.sequence)
      commit(types.SET_SEQUENCE_LIST, list)
      commit(types.SET_PLAY_LIST, list)
      commit(types.SET_CURRENT_INDEX, index)
      commit(types.SET_PLAYING_STATE, true)
      commit(types.SET_FULL_SCREEN, true)
    },
    // 随机播放
    randomPlay ({ commit }, list) {
      commit(types.SET_PLAY_MODE, PLAY_MODE.random)
      commit(types.SET_SEQUENCE_LIST, list)
      commit(types.SET_PLAY_LIST, shuffle(list))
      commit(types.SET_PLAYING_STATE, true)
      commit(types.SET_CURRENT_INDEX, 0)
      commit(types.SET_FULL_SCREEN, true)
    },
    // 切换播放模式
    changeMode ({ state, getters, commit }, mode) {
      // 记录当前播放歌曲id
      const currentId = getters.currentSong.id
      // 随机播放模式，将列表乱序洗牌，其他模式正常顺序
      if (mode === PLAY_MODE.random) {
        commit(types.SET_PLAY_LIST, shuffle(state.sequenceList))
      } else {
        commit(types.SET_PLAY_LIST, state.sequenceList)
      }
      // 找到播放列表改变前正在播放的歌曲，在改变后的list中所处index位置，将它做为当前播放的index
      const index = state.playlist.findIndex((song: { [key: string]: any }) => song.id === currentId)
      commit(types.SET_CURRENT_INDEX, index)
      commit(types.SET_PLAY_MODE, mode)
    }
  },
  modules: {
  }
})
