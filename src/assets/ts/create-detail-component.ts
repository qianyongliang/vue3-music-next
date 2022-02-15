import MusicList from '@/components/music-list/music-list'
import { computed, ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const createDetailComponent = (name: string, key: string, fetch: any) => {
  return {
    name,
    components: { MusicList },
    props: {
      data: Object
    },
    setup (props: any) {
      const route = useRoute()
      const router = useRouter()
      // 缓存的数据，歌手、专辑
      const computedData = computed(() => {
        let ret = null
        const data = toRaw(props.data)
        if (Object.keys(data).length) {
          ret = data
        } else {
          const cached = JSON.parse(sessionStorage.getItem(key) || '')
          if ((cached?.mid || cached?.id + '') === route.params.id) {
            ret = cached
          }
        }
        return ret
      })
      // 背景大图
      const pic = computed(() => {
        const data = computedData.value
        return data?.pic
      })
      // 歌手名或专辑名
      const title = computed(() => {
        const data = computedData.value
        return data?.name || data?.title
      })
      const loading = ref(true)
      const songs = ref([])
      const init = () => {
        const data = computedData.value
        if (!data) {
          // 没有id返回上一页
          const path = route.matched[0].path
          router.push({
            path
          })
        }
        fetch(data).then((res: any) => {
          songs.value = res.songs
          loading.value = false
        })
      }
      init()
      return {
        pic,
        title,
        songs,
        loading
      }
    }
  }
}

export default createDetailComponent
