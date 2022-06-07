import { save, remove, clear } from '@/assets/ts/array-store'
import { SEARCH_KEY } from '@/assets/ts/constant'
import { useStore } from 'vuex'
import * as types from '@/store/mutations-type'

const useSearchHistory = (): any => {
  const maxLen = 200

  const store = useStore()

  // 存储搜索历史
  const saveSearch = (query: string) => {
    const searches = save(query, SEARCH_KEY, (item) => {
      return item === query
    }, maxLen)
    store.commit(types.SET_SEARCH_HISTORY, searches)
  }

  // 删除搜索历史
  const deleteSearch = (query: string) => {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })
    store.commit(types.SET_SEARCH_HISTORY, searches)
  }

  // 清空搜索历史
  const clearSearch = () => {
    const searches = clear(SEARCH_KEY)
    store.commit(types.SET_SEARCH_HISTORY, searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}

export default useSearchHistory
