import { createStore } from 'vuex'
import * as types from './mutations-type'

export default createStore({
  state: {
    // 播放器页面是否全屏
    fullScreen: false,
    // 播放歌曲列表
    playlist: [],
    // 当前播放歌曲index
    currentIndex: 0
  },
  getters: {
    currentSong: state => state.playlist[state.currentIndex] || {}
  },
  mutations: {
    [types.SETFULLSCREEN] (state, fullScreen) {
      state.fullScreen = fullScreen
    },
    [types.SETPLAYLIST] (state, list) {
      state.playlist = list
    },
    [types.SETCURRENTINDEX] (state, index) {
      state.currentIndex = index
    }
  },
  actions: {
    selectPlay ({ commit }, { list, index }) {
      commit(types.SETFULLSCREEN, true)
      commit(types.SETPLAYLIST, list)
      commit(types.SETCURRENTINDEX, index)
    }
  },
  modules: {
  }
})
