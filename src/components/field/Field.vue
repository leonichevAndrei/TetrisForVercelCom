<script setup lang="ts">
import Column from './Column.vue';
const props = defineProps(['width', 'height']);
</script>

<template>
  <div class="field">
    <Column :x="index - 1" v-for="index in props.height" :width="props.width" />
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>
