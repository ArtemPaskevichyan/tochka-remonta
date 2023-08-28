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
import AccessDeniedPage from "@/public/pages/message/AccessDeniedPage.vue"
import SEOArticlesList from "@/public/pages/SEOcreationPages/SEOArticlesList.vue"
import SEOArticlesCreation from "@/public/pages/SEOcreationPages/SEOArticlesCreation.vue"
import APIPage from "@/public/pages/APIpages/APIPage.vue"
import ChatPage from "@/public/pages/chat/ChatPage.vue"
import LandingPage from "@/public/landing/LandingPage.vue"

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
import UserOutcomingSuggestionsPage from "@/user/pages/outcomingSuggestions/OutcomingSuggestionsPage.vue"


import MakerSettingsPage from '@/maker/pages/settingsPage/SettingsPage.vue'
import MakerSearchPage from '@/maker/pages/searchPage/SearchPage.vue'
import MakerProjectPage from '@/maker/pages/project/MakerProjectPage.vue'
import MakerMyProjectsPage from "@/maker/pages/myProjects/MyProjectsPage.vue"
import MakerNotificationPage from "@/maker/pages/notifications/NotificationPage.vue"
import MakerCreateProjectPage from "@/maker/pages/createProject/CreateProjectPage.vue"
import SuggestionsPage from "@/maker/pages/suggestions/SuggestionsPage.vue"
import MakerOutcomingSuggestionsPage from "@/maker/pages/outcomingSuggestions/OutcomingSuggestionsPage.vue"


import TestPage from "@/public/pages/message/TestPage.vue"

import {UserDataController} from "@/helpers/UserDataController.js"

const DEFALT_TITLE = "Точка ремонта"
const routes = [
  {
    path: '/chat',
    name: 'chat',
    component: ChatPage,
  },
  {
    path: '/',
    name: 'index',
    component: LandingPage,
  },
  {
    path: '/test',
    name: 'test',
    component: TestPage,
  },
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
    name: 'succesfulRegistration',
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
    path: '/seo/articles',
    component: SEOArticlesList,
  },
  {
    path: '/seo/createArticle',
    component: SEOArticlesCreation,
  },
  {
    path: '/documentation/:page?',
    name: 'documentation',
    component: APIPage,
    props: true,
    meta: {
      title: "API Документация",
    }
  },

  {
    path: '/user/search',
    name: 'userSearch',
    component: UserSearchPage,
  },
  {
    path: '/user/createProject',
    name: 'userCreateProject',
    component: CreateProjectPage,
  },
  {
    path: '/user/myProjects',
    name: 'userMyProjects',
    component: MyProjectsPage,
  },
  {
    path: '/user/settingsPage',
    name: 'userSettingsPage',
    component: SettingsPage,
  },
  {
    path: '/user/submitPhonePage',
    name: 'user/submitPhonePage',
    component: SubmitPhonePage,
  },
  {
    path: '/user/successNumberSubmition',
    name: 'user/successNumberSubmition',
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
    name: 'userNotifications',
    component: NotificationPage,
  },
  {
    path: '/user/outcomingSuggestions',
    name: 'userOutcomingSuggestions',
    component: UserOutcomingSuggestionsPage,
  },

  {
    path: '/maker/settingsPage',
    name: 'makerSettingsPage',
    component: MakerSettingsPage,
  },
  {
    path: '/maker/search',
    name: 'makerSearch',
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
    name: 'makerMyProjects',
    component: MakerMyProjectsPage,
  },
  {
    path: '/maker/notifications',
    name: 'makerNotifications',
    component: MakerNotificationPage,
  },
  {
    path: '/maker/createProject',
    name: 'makerCreateProject',
    component: MakerCreateProjectPage,
  },
  {
    path: '/maker/suggestions',
    component: SuggestionsPage,
  },
  {
    path: '/maker/outcomingSuggestions',
    name: 'makerOutcomingSuggestions',
    component: MakerOutcomingSuggestionsPage,
  },


  {
    path: '/accessDenied',
    name: 'accessDeniedPage',
    component: AccessDeniedPage,
  },
  {
    path: '/:pathMatch(.*)',
    name: "notFoundPage",
    component: NotFoundPage,
  },
]

const COMMON_ROUTES_NAMES = [
  'user/successNumberSubmition',
  'user/submitPhonePage',
  'user/makerPage',
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach(async (to, from) => {
  if (COMMON_ROUTES_NAMES.includes(to?.name)) return true

  const prefix = to.fullPath.split('/')[1]

  if (prefix == "user" || prefix == "maker") {
    const role = (await UserDataController.shared.getData())?.role

    if (role == "customer" && prefix == "maker" || role == "contractor" && prefix == "user") return { name: "accessDeniedPage" }
  }

  document.title = to.meta.title ?? DEFALT_TITLE

  return true
})

export default router



