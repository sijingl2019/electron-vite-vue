import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/MainBoard.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/settings/index.vue'),
  },
  // {
  //   path: '/toolbox',
  //   name: 'toolbox',
  //   component: () => import('../views/Toolbox.vue'),
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
