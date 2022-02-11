<template>
  <div class="singer-detail">歌手详情</div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'singer-detail'
})
</script>
<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
