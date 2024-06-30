<script setup lang="ts">
import { computed } from 'vue';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
const props = defineProps(['x', 'y']);

const elmStatus = computed(() => {
  if (
    tetrisStore.getFieldMatrixRef().value[props.x] !== undefined &&
    tetrisStore.getFieldMatrixRef().value[props.x][props.y] == 0
  ) {
    return 'elm_empty';
  } else {
    return 'elm_filled';
  }
});
</script>

<template>
  <div :class="['element', elmStatus]"></div>
</template>
