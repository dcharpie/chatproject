import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/profile.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/Chat.vue')
      },
      {
        path: '/support',
        name: 'Support',
        component: () => import('@/views/Support.vue')
      },
      {
        path: '/sales',
        name: 'Sales',
        component: () => import('@/views/Sales.vue')
      },
  ]
  });
  
  export default router;