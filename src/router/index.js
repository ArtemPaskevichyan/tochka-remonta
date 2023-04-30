import { createRouter, createWebHistory } from 'vue-router'
import RegistrationPage from "@/public/pages/registration/RegistrationPage.vue"
import LoginPage from "@/public/pages/login/LoginPage.vue"
import MessagePage from "@/public/pages/message/MessagePage.vue"
import CheckEmailPage from "@/public/pages/checkEmailPage/CheckEmailPage.vue"
import ForgotPasswordPage from "@/public/pages/forgotPassword/ForgotPasswordPage.vue"
import PasswordRecoveryPage from "@/public/pages/passwordRecovery/PasswordRecoveryPage.vue"
import CheckEmailPageForRecovery from "@/public/pages/checkEmailPage/CheckEmailPageForRecovery.vue"
import SuccessfulPasswordChangePage from "@/public/pages/message/SuccessfulPasswordChangePage.vue"
import NotFoundPage from "@/public/pages/message/NotFoundPage.vue"

import UserSearchPage from "@/user/pages/searchPage/SearchPage.vue"
import CreateProjectPage from "@/user/pages/createProject/CreateProjectPage.vue"
import MyProjectsPage from "@/user/pages/myProjects/MyProjectsPage.vue"
import SuccessfulPage from "@/public/pages/successfulRegistration/SuccessfulRegistrationPage.vue"
import SettingsPage from "@/user/pages/settingsPage/SettingsPage.vue"
import SubmitPhonePage from "@/user/pages/settingsPage/SubmitPhonePage.vue"
import SuccessNumberSubmition from '@/user/pages/settingsPage/SuccessNumberSubmition.vue'
import UserProjectPage from '@/user/pages/project/UserProjectPage.vue'
import MakerPage from '@/user/pages/makerPage/MakerPage.vue'
import NotificationPage from "@/user/pages/notifications/NotificationPage.vue"


import MakerSettingsPage from '@/maker/pages/settingsPage/SettingsPage.vue'
import MakerSearchPage from '@/maker/pages/searchPage/SearchPage.vue'
import MakerProjectPage from '@/maker/pages/project/MakerProjectPage.vue'
import MakerMyProjectsPage from "@/maker/pages/myProjects/MyProjectsPage.vue"
import MakerNotificationPage from "@/maker/pages/notifications/NotificationPage.vue"
import MakerCreateProjectPage from "@/maker/pages/createProject/CreateProjectPage.vue"

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
  {
    path: '/message/:title/:text',
    name: 'message',
    component: MessagePage,
    props: true,
  },
  {
    path: '/checkEmail/:email',
    name: 'checkEmail',
    component: CheckEmailPage,
    props: true,
  },
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    component: ForgotPasswordPage,
  },
  {
    path: '/recovery',
    name: 'recovery',
    component: PasswordRecoveryPage,
  },
  {
    path: '/succesfulRegistration',
    component: SuccessfulPage,
  },
  {
    path: '/checkEmailForRecovery/:email',
    name: 'checkEmailForRecovery',
    component: CheckEmailPageForRecovery,
    props: true,
  },
  {
    path: '/successfulPasswordChange',
    component: SuccessfulPasswordChangePage,
  },

  {
    path: '/user/search',
    component: UserSearchPage,
  },
  {
    path: '/user/createProject',
    component: CreateProjectPage,
  },
  {
    path: '/user/myProjects',
    component: MyProjectsPage,
  },
  {
    path: '/user/settingsPage',
    component: SettingsPage,
  },
  {
    path: '/user/submitPhonePage',
    component: SubmitPhonePage,
  },
  {
    path: '/user/successNumberSubmition',
    component: SuccessNumberSubmition,
  },
  {
    path: '/user/project/:projectId',
    name: 'user/project',
    component: UserProjectPage,
    props: true,
  },
  {
    path: '/user/makerPage/:uuid',
    name: 'user/makerPage',
    component: MakerPage,
    props: true,
  },
  {
    path: '/user/notifications',
    component: NotificationPage,
  },

  {
    path: '/maker/settingsPage',
    component: MakerSettingsPage,
  },
  {
    path: '/maker/search',
    component: MakerSearchPage,
  },
  {
    path: '/maker/project/:projectId',
    name: 'maker/project',
    component: MakerProjectPage,
    props: true,
  },
  {
    path: '/maker/myProjects',
    component: MakerMyProjectsPage,
  },
  {
    path: '/maker/notifications',
    component: MakerNotificationPage,
  },
  {
    path: '/maker/createProject',
    component: MakerCreateProjectPage,
  },

  {
    path: '/:pathMatch(.*)',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
