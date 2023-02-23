import { createRouter, createWebHistory } from 'vue-router'
import RegistrationPage from "@/public/pages/registration/RegistrationPage.vue"
import LoginPage from "@/public/pages/login/LoginPage.vue"

const routes = [
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
