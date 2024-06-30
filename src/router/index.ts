import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import MainView from '../views/MainView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
  ],
});

export default router;
