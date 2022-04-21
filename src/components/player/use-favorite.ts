import { useStore } from 'vuex'
import { computed } from 'vue'
import * as types from '@/store/mutations-type'
import { save, remove } from '@/assets/ts/array-store'
import { FAVORITE_KEY } from '@/assets/ts/constant'

interface Song {
  [key: string]: number | string
}

const useFavorite = (): any => {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  // 收藏样式
  const getFavoriteIcon = (song: Song): string => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 是否收藏
  const isFavorite = (song: Song): boolean => {
    return favoriteList.value.findIndex((item: Song) => {
      return item.id === song.id
    }) > -1
  }

  const toggleFavorite = (song: Song) => {
    const compare = (item: Song) => {
      return item.id === song.id
    }
    let list: Array<Song> = []
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit(types.SET_FAVORITE_LIST, list)
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}

export default useFavorite
