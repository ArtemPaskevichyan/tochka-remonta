<template>
  <div class="API__header">
    <div class="API__headerLogo">
      <img src="@/assets/images/logo.png" alt="logo" width="96" height="32" @click="$router.push('login')"/>
    </div>

    <span class="API__headerLabel">Официальная документация. tochka-remonta-API</span>
  </div>
  <div class="headerPage API">
    <div class="API__leftSide">
      <div class="API__leftSideLink"
      :class="{active: currentPage.name == 'auth'}"
      @click="changePage('auth')">
        Авторизация <br/>(Информация о пользователях, Email, Работа с телефонами, Города)
      </div>
      <div class="API__leftSideLink"
      :class="{active: currentPage.name == 'projects'}"
      @click="changePage('projects')">
        Проекты <br/>(Информация о проектах, Достижения, Поиск)
      </div>
      <div class="API__leftSideLink"
      :class="{active: currentPage.name == 'seo'}"
      @click="changePage('seo')">
        Блог. <br/>SEO-инструменты
      </div>
      <div class="API__leftSideLink"
      :class="{active: currentPage.name == 'notifications'}"
      @click="changePage('notifications')">
        Уведомления
      </div>
    </div>
    <div class="API__content">
      <iframe
        :src="currentPage.link" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        {
          name: "auth",
          link: "https://api.tochka-remonta.site/api/v1/auth/swagger/index.html",
        },
        {
          name: "projects",
          link: "https://api.tochka-remonta.site/api/v1/projects/swagger/index.html",
        },
        {
          name: "seo",
          link: "https://api.tochka-remonta.site/api/v1/blog/swagger/index.html",
        },
        {
          name: "notifications",
          link: "https://api.tochka-remonta.site/api/v1/notifications/swagger/index.html",
        },
      ],
      currentPage: {
        name: "auth",
        link: "https://api.tochka-remonta.site/api/v1/auth/swagger/index.html",
      },
    }
  },
  props: {
    page: {
      type: String,
      default: "auth",
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = this.pages.find(e => e.name == page) ?? this.pages[0]
    }
  }
}
</script>