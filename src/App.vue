<template>
  <div id="nav">
    <m-header />
    <tab/>
  </div>
  <router-view />
  <player></player>
</template>
<script>
import { defineComponent } from 'vue'
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
export default defineComponent({
  name: 'app',
  components: {
    MHeader: Header,
    Tab,
    Player
  }
})
</script>

<style lang="scss"></style>
