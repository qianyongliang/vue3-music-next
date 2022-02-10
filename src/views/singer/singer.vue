<template>
  <div class="singer">
    <singer-list :data="singers"></singer-list>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import SingerList from '@/components/singer-list/singer-list'
import { getSingerList } from '@/service/singer'
export default defineComponent({
  name: 'singer',
  components: {
    SingerList
  },
  setup () {
    const state = reactive({
      singers: []
    })

    const getSingerListRes = () => {
      getSingerList().then((res) => {
        state.singers = res.singers
        console.log(res)
      })
    }
    getSingerListRes()

    return {
      ...toRefs(state)
    }
  }
})
</script>
<style scoped lang="scss"></style>
