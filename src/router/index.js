import { createRouter, createWebHistory } from 'vue-router'
import TestPage from "@/user/pages/TestPage.vue"

const routes = [
  {
    path: '/',
    name: 'home',
    component: TestPage
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
