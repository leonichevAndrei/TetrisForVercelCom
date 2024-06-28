<script setup lang="ts">
import { computed, ref, onMounted, type Ref, watch } from 'vue';
import { useTetrisStore } from '@/stores/tetris';
import axios from 'axios';
import { addToLeaderboard } from '@/utills/tetris.store.utills';
const tetrisStore = useTetrisStore();

const name = ref('');
const newHighScore = ref(false);
const recordSubmitted = ref(false);
const apiData: Ref<{ data: { name: string; points: number }[] }> = ref({
  data: [],
});
const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());

async function getData() {
  try {
    const response = await axios.get('/api/handleData');
    apiData.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
async function updateData(newData: {
  data: { name: string; points: number }[];
}) {
  try {
    const response = await axios.post('/api/handleData', newData);
    console.log('Update response:', response.data);
  } catch (error) {
    console.error('Error updating data:', error);
  }
}
function checkName() {
  if (name.value.length > 20) {
    name.value = name.value.substring(0, 20);
  }
  const regex = /^[A-Za-z\s]+$/;
  if (!regex.test(name.value)) {
    name.value = name.value.substring(0, name.value.length - 1);
  }
}
function submitRecord() {
  if (name.value.length >= 3) {
    apiData.value = addToLeaderboard(
      apiData.value.data,
      name.value,
      tetrisStore.getScore
    );
    updateData(apiData.value);
    recordSubmitted.value = true;
  }
}
onMounted(async () => {
  await getData();
  if (
    apiData.value.data.length > 0 &&
    apiData.value.data[9].points < tetrisStore.getScore
  ) {
    newHighScore.value = true;
  }
});
</script>

<template>
  <div
    v-if="apiData.data.length > 0"
    class="sub-field"
    :style="{
      width: widthPixels.value + 'px',
      height: heightPixels.value + 'px',
    }"
  >
    <div class="sub-field-in game-over">
      <div v-if="!recordSubmitted" class="title">GAME OVER</div>
      <div v-if="!recordSubmitted" class="score">
        Final score:&nbsp;<span>{{ tetrisStore.getScore }}</span>
      </div>
      <div v-if="newHighScore && !recordSubmitted" class="record">
        IT'S A NEW RECORD!
      </div>
      <div v-if="recordSubmitted" class="score-added">SCORE SAVED!</div>
      <div v-if="newHighScore && !recordSubmitted" class="enter-name">
        Please, enter your name (3-20 letters):
      </div>
      <div v-if="newHighScore && !recordSubmitted" class="for-input">
        <input v-model="name" @input="checkName" type="text" />&nbsp;
        <button @click="submitRecord">Send</button>
      </div>
      <div class="leaderboard">LEADERBOARD:</div>
      <div class="list">
        <table cellspacing="0" cellpadding="0">
          <tr v-for="(entry, index) in apiData.data" :key="index">
            <td class="number">{{ index + 1 }}.</td>
            <td class="name">{{ entry.name }}</td>
            <td class="points">{{ entry.points }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>
