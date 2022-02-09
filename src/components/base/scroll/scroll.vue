<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useScroll } from './use-scroll'

export default defineComponent({
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'],
  setup (props, { emit }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)
    return {
      rootRef,
      scroll
    }
  }
})
</script>
