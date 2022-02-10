<template>
  <div class="album">
    <music-list></music-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MusicList from '@/components/music-list/music-list.vue'
export default defineComponent({
  name: 'album',
  components: {
    MusicList
  }
})
</script>
<style lang="scss" scoped>
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
