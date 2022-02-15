<template>
  <div class="top-list">排行</div>
</template>
<script>
import { defineComponent } from 'vue'
import { getTopList } from '@/service/topList'
export default defineComponent({
  name: 'top-list',
  setup () {
    const getTopListRes = () => {
      getTopList().then((res) => {
        console.log(res)
      })
    }
    // getTopListRes()
  }
})
</script>
<style scoped lang="scss"></style>
