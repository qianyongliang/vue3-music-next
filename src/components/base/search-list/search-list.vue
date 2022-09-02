<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li
        v-for="item in searches"
        :key="item"
        class="search-item"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span v-if="showDelete" class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'search-list',
  props: {
    searches: {
      type: Array as PropType<Array<any>>,
      default: () => []
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select', 'delete'],
  setup (props, { emit }) {
    const selectItem = (item: any) => {
      emit('select', item)
    }
    const deleteItem = (item: any) => {
      emit('delete', item)
    }
    return {
      selectItem,
      deleteItem
    }
  }
})
</script>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
