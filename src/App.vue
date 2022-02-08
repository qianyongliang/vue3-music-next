<template>
  <div id="nav">
    <m-header />
    <tab/>
  </div>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab.vue'
export default defineComponent({
  name: 'app',
  components: {
    MHeader: Header,
    Tab
  }
})
</script>

<style lang="scss"></style>
