<script setup lang='ts'>
import ControlPanelButton from './ControlPanelButton.vue';
import ControlPanelInput from './ControlPanelInput.vue';
import InfoPanel from './InfoPanel.vue';
import conf from '@/config/tetris.config.ts';
import { appStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
</script>

<template>
  <div class='control-panel'>
    <div v-if="appStateEnum[tetrisStore.getAppState]=='init'" class='line'>
      <ControlPanelButton title='Start Game' :appState='appStateEnum.runned' />
    </div>
    <div v-if="appStateEnum[tetrisStore.getAppState]=='runned'" class='line'>
      <ControlPanelButton title='End Game' :appState='appStateEnum.finished' />
    </div>
    <div v-if="appStateEnum[tetrisStore.getAppState]=='finished'" class='line'>
      <ControlPanelButton title='New Game' :appState='appStateEnum.init' />
    </div>
    <div v-if="appStateEnum[tetrisStore.getAppState]=='init'" class='line'>
      <div class='elements-block'>
        <div class='left'><ControlPanelInput title='Width' :range="conf.width" :value="tetrisStore.getWidth" :updateStoreFunc="tetrisStore.setWidth" /></div>
        <div class='center'><ControlPanelInput title='Height' :range="conf.height" :value="tetrisStore.getHeight" :updateStoreFunc="tetrisStore.setHeight" /></div>
        <div class='right'><ControlPanelInput title='Speed' :range="conf.speedLevels" :value="tetrisStore.getSpeedLevel" :updateStoreFunc="tetrisStore.setSpeedLevel" /></div>
      </div>
    </div>
    <div v-if="appStateEnum[tetrisStore.getAppState]!='init'" class='line'>
      <InfoPanel />
    </div>
  </div>
</template>

<style>
@import '../../assets/style/control-panel.css';
</style>
