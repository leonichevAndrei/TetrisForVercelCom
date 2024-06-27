<script setup lang='ts'>
import { computed } from 'vue';
import { triggerKeyUpEvent, triggerKeyDownEvent, useKeyEvents } from '@/utills/key.events.utills';
import { appStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();

const showArea = computed(() => tetrisStore.getAppState == appStateEnum['init']);
const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());
useKeyEvents();
</script>

<template>
  <div class="sub-field" :style="{ width: widthPixels.value + 'px', height: heightPixels.value + 'px'}">
    <div class="sub-field-in">
      <div class="top">
        <div :class="['arrow-left', {'show-left-area': showArea}]">
          <button
            class="animated-button" 
            @touchstart.prevent="triggerKeyDownEvent('ArrowLeft')" 
            @touchend.prevent="triggerKeyUpEvent('ArrowLeft')"
            ><span v-if="showArea">Tap or hold<br />area to move<br /><span>LEFT</span></span></button>
        </div>
        <div :class="['space', {'show-space-area': showArea}]">
          <button 
            class="animated-button" 
            @touchstart.prevent="triggerKeyDownEvent('Space')" 
            @touchend.prevent="triggerKeyUpEvent('Space')"
          ><span v-if="showArea">Tap area to<br /><span>ROTATE</span></span></button>
        </div>
        <div :class="['arrow-right', {'show-right-area': showArea}]">
          <button 
            class="animated-button" 
            @touchstart.prevent="triggerKeyDownEvent('ArrowRight')" 
            @touchend.prevent="triggerKeyUpEvent('ArrowRight')"
          ><span v-if="showArea">Tap or hold<br />area to move<br /><span>RIGHT</span></span></button>
        </div>
      </div>
      <div :class="['arrow-down', {'show-down-area': showArea}]">
        <button 
          class="animated-button" 
          @touchstart.prevent="triggerKeyDownEvent('ArrowDown')" 
          @touchend.prevent="triggerKeyUpEvent('ArrowDown')"
        ><span v-if="showArea">Tap or hold<br />area to move<br /><span>DOWN</span></span></button>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>
