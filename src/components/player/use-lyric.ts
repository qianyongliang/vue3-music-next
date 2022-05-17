import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import * as types from '@/store/mutations-type'
import { getLyric } from '@/service/song'
// 解析歌词的库
import Lyric from 'lyric-parser'

const useLyric = ({ songReady, currentTime }: any): any => {
  const currentLyric = ref<any>(null)
  const currentLineNum = ref<number>(0) // 当前歌词行数
  // 纯音乐
  const pureMusicLyric = ref<any>('')
  const playingLyric = ref<any>('')
  // 滚动
  const lyricScrollRef = ref<any>(null)
  const lyricListRef = ref<any>(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  // 监听当前歌曲切换，调用对应歌词数据
  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }

    // 切换歌曲时清空歌词播放信息 start -----
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''
    // end ------

    const lyric = await getLyric(newSong)
    // 将歌词缓存到对应歌曲中
    store.commit(types.SET_SONG_LYRIC, {
      song: newSong,
      lyric
    })
    // 如果在获取歌词的时候发生了切换，不做处理
    if (currentSong.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric?.value?.lines?.length
    // 是否是没有歌词的纯音乐
    if (hasLyric) {
      // 如果歌曲准备播放了
      if (songReady.value) {
        // 播放
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  // 处理歌词，播放时会触发这个函数
  const handleLyric = ({ lineNum, txt } : { lineNum: number, txt: string }) => {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    // 歌词滚动处理
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    // 如果在5行之内，不滚动(置顶), 5行之后开始滚动到【当前行-5行】的位置上，为了使滚动在中间
    if (lineNum > 5) {
      const lineEl = listEl?.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  // 播放歌词,因为歌词准备好了，或歌曲准备好了是异步，所以导出两边都可执行
  const playLyric = () => {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // 歌词跳转，并到同步时间
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }
  // 暂停播放
  const stopLyric = () => {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }
  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric
  }
}
export default useLyric
