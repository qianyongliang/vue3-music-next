<template>
  <div class="album">
    <music-list
      :title="title"
      :pic="pic"
      :songs="songs"
    ></music-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import createDetailComponent from '@/assets/ts/create-detail-component'
import { ALBUM_KEY } from '@/assets/ts/constant'
import { getAlbum } from '@/service/recommend'

export default defineComponent(
  createDetailComponent('album', ALBUM_KEY, getAlbum)
)
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
