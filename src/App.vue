<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view :style="viewStyle" name="user" v-slot="{ Component }">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <player></player>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useState } from '@/hooks/useVuexHooks'
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
export default defineComponent({
  name: 'app',
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  setup () {
    const { playlist } = useState('', ['playlist'])
    const viewStyle = computed(() => {
      return playlist.length ? '60px' : '0'
    })

    return {
      viewStyle
    }
  }
})
</script>

<style lang="scss"></style>
