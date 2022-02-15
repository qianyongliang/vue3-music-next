<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>
<script lang="ts">
import createDetailComponent from '@/assets/ts/create-detail-component'
import { defineComponent } from 'vue'
import { getSingerDetail } from '@/service/singer'
import { SINGER_KEY } from '@/assets/ts/constant'

export default defineComponent(
  createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
)

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
