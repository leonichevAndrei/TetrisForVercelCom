<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue';

const props = defineProps(['title', 'range', 'value', 'updateStoreFunc']);
const inputValue = ref(props.value);
const isMobile = ref(false);

function checkAndSetInputValue(event: any) {
  const value = event.target.value;
  const parsedValue = parseInt(value);
  if (parsedValue.toString() !== value) {
    if (parsedValue >= 0) {
      inputValue.value = parsedValue.toString();
    } else {
      inputValue.value = '';
    }
  }
  if (parsedValue > props.range.max) {
    inputValue.value = props.range.max;
  }
}
function checkInputOnFocus() {
  if (inputValue.value == '0') inputValue.value = '';
}
function checkInputOnBlur() {
  if (inputValue.value == '') {
    inputValue.value = props.range.min;
  } else {
    const parsedValue = parseInt(inputValue.value);
    checkMinMax(parsedValue);
  }
}
function checkMinMax(parsedValue: number) {
  if (parsedValue < props.range.min) {
    inputValue.value = props.range.min;
  } else if (parsedValue > props.range.max) {
    inputValue.value = props.range.max;
  }
}

watch(inputValue, (newInputValue) => {
  if (newInputValue >= props.range.min) {
    props.updateStoreFunc(parseInt(newInputValue));
  }
})

onMounted(() => {
  isMobile.value = /android|iPad|iPhone|iPod/i.test(navigator.userAgent) && (props.title == 'Width' || props.title == 'Height');
});
</script>

<template>
  <div class='menu-item'>
    <label>{{title}}:&nbsp;</label>
    <input 
      v-model='inputValue'
      @input='checkAndSetInputValue'
      @keyup.enter='checkInputOnBlur'
      @focus='checkInputOnFocus'
      @blur='checkInputOnBlur'
      v-bind:readonly="isMobile"
    />
  </div>
</template>
