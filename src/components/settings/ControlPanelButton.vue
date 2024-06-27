<script setup lang='ts'>
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
const props = defineProps(['title', 'appState']);
</script>

<template>
  <div class='menu-item'>
    <button @click="tetrisStore.setAppState(props.appState)">{{ props.title }}</button>
  </div>
</template>
