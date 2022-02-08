<template>
  <div class="tab">
    <router-link
      class="tab-item"
      v-for="tab in tabs"
      :to="tab.path"
      :key="tab.name"
    >
      <span class="tab-link">
        {{ tab.name }}
      </span>
    </router-link>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'tab',
  setup () {
    const state = reactive({
      tabs: [
        {
          name: '推荐',
          path: '/recommend'
        },
        {
          name: '歌手',
          path: '/singer'
        },
        {
          name: '排行',
          path: '/top-list'
        },
        {
          name: '搜索',
          path: '/search'
        }
      ]
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
<style scoped lang="scss">
.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
    }

    &.router-link-active {
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
