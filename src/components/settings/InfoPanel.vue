<script setup lang="ts">
import { computed } from 'vue';
import conf from '@/config/tetris.config.ts';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();

const imgSrc = computed(
  () => '/images/' + conf.elementsIcons[tetrisStore.getNextElementId]
);
</script>

<template>
  <div class="elements-block">
    <div class="left">
      Speed:&nbsp;<span>{{ tetrisStore.getSpeedLevel }}</span
      >&nbsp;
      <p>[{{ tetrisStore.getFallingSpeed }} ms]</p>
    </div>
    <div class="center">
      Score:&nbsp;<span>{{ tetrisStore.getScore }}</span>
    </div>
    <div class="right">
      <div>Next:&nbsp;</div>
      <div class="elm2"><img :src="imgSrc" /></div>
    </div>
  </div>
</template>

<style>
@import '../../assets/style/control-panel.css';
</style>
