<script setup lang='ts'>
import { computed, type Ref } from 'vue';
import ControlPanel from '@/components/settings/ControlPanel.vue'
import Field from '@/components/field//Field.vue'
import TouchControls from '@/components/field/TouchControls.vue';
import ControlsInfo from '@/components/field/ControlsInfo.vue';
import GameOver from '@/components/field/GameOver.vue';
import { appStateEnum } from '@/config/tetris.enums';
import { useKeyEvents } from '@/utills/key.events.utills';
import { useDimensionsChange } from '@/utills/hooks.utills';
import { isMobileDevice } from '@/utills/common.utills';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
let width: Ref<number>;
let height: Ref<number>;

let templateIdForUpdate = computed(() => 'mainViewId' + tetrisStore.getFramesRef().value);
[width, height] = useDimensionsChange(tetrisStore);
useKeyEvents();
</script>

<template>
  <div class='main-view' :id="templateIdForUpdate">
    <ControlPanel />
    <Field :width="width" :height="height" />
    <TouchControls v-if="isMobileDevice()" />
    <ControlsInfo v-if="!isMobileDevice()" />
    <GameOver v-if="appStateEnum[tetrisStore.getAppState]=='finished'" />
  </div>
</template>

<style scoped>
</style>
