<script setup lang="ts">
import { computed } from 'vue';
import { appStateEnum } from '@/config/tetris.enums';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();

const showInfo = computed(
  () => tetrisStore.getAppState == appStateEnum['init']
);
const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());
</script>

<template>
  <div
    v-if="showInfo"
    class="sub-field"
    :style="{
      width: widthPixels.value + 'px',
      height: heightPixels.value + 'px',
    }"
  >
    <div class="sub-field-in show-info">
      <div>
        <span class="awesome"
          ><FontAwesomeIcon
            :icon="faKeyboard"
            style="
              font-size: 22px;
              position: relative;
              top: 3px;
              left: -2px;
            " /></span
        >&nbsp;&nbsp;Use the &nbsp;<span class="bold">KEYBOARD</span>&nbsp; to
        play the game
      </div>
      <div>
        <span class="key"><span class="key-in symbol">↓</span></span
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press the
        <span class="bold">&nbsp;DOWN ARROW&nbsp;</span> to move down
      </div>
      <div>
        <span class="key"><span class="key-in symbol">←</span></span
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press the
        <span class="bold">&nbsp;LEFT ARROW&nbsp;</span> to move left
      </div>
      <div>
        <span class="key"><span class="key-in symbol">→</span></span
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press the
        <span class="bold">&nbsp;RIGHT ARROW&nbsp;</span> to move right
      </div>
      <div>
        <span class="key"><span class="key-in symbol-space">␣</span></span
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press
        <span class="bold">&nbsp;SPACE&nbsp;</span> to rotate an element
      </div>
      <div>
        <span class="key"><span class="key-in text">Ctrl</span></span
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press
        <span class="bold">&nbsp;CONTROL&nbsp;</span> to start or end the game
      </div>
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>
