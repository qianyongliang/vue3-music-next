<template>
  <div class="loading">
    <div class="loading-content">
      <img src="./loading.gif" width="24" height="24" />
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'loading',
  setup () {
    const title = ref<string>('正在载入...')

    const setTitle = (str: string) => {
      title.value = str
    }

    return {
      title,
      setTitle
    }
  }
})
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>
