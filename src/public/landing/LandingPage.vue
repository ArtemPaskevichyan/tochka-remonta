<template>
<header class="header clear" ref="header">
  <a class="header__logo">
    <img class="desktopOnly" src="./images/Logo.png" alt="logo">
    <img class="mobileOnly" src="./images/shortLogo.png" alt="logo">
  </a>
  <div class="header__controls">
    <router-link class="header__controlsPrimaryButton header__controlButton" to="/login">
      Войти
    </router-link>
    <router-link class="header__controlsLightButton header__controlButton" to="/registration">
      Регистрация
    </router-link>
  </div>
</header>
<div class="root">
  <section class="cover">
    <div class="cover__content">
      <h1 class="cover__title">Доверьте заботы профессионалам</h1>
      <h2 class="cover__text">Платформа, которая поможет со всем, что нужно, для ремонта Вашей мечты</h2>
      <nav class="cover__navigation">
        <router-link class="cover__link_dark" to="/login">Найти исполнителя</router-link>
      </nav>
      <nav class="cover__linkBar">
        <a href="#intro" class="cover__link_inline">Капитальный ремонт</a>
        <a href="#intro" class="cover__link_inline">Косметический ремонт</a>
        <a href="#intro" class="cover__link_inline">Дизайн проект</a>
      </nav>
    </div>
  </section> 

  <section class="intro" id="intro">
    <h2 class="intro__text blockTitle">Чем вам поможет платформа?</h2>
    <Swiper
      :breakpoints="defaultBreakpoints"
      class="intro__blocks"
      @swiper="swiper => { introSwiper = swiper }"
    >
      <SwiperSlide v-for="(i, index) in introList" :key="index">
        <div class="intro__block">
          <div class="intro__imageHolder">
            <img class="intro__image" :src="getImgUrl(i.imageName)">
          </div>
          <div class="intro__gradient">
            <h3 class="intro__title">{{ i.title }}</h3>
            <p class="intro__subtitle">{{ i.text }}</p>
            <a class="intro__link">Подробнее об услуге -></a>
          </div>
        </div>
      </SwiperSlide>
      <span class="navButton left intro__navButton" @click="introBackward">
        <img src="./images/arrowLeft.png"/>
      </span>
      <span class="navButton right intro__navButton" @click="introForvard">
        <img src="./images/arrowRight.png"/>
      </span>
    </Swiper>
  </section>

  <section class="instruction">
    <h2 class="instruction__text blockTitle">Как сделать ремонт на сайте?</h2>
    <div class="instruction__grid">
          <!-- Одна секция -->
      <div class="instruction__block">
        <h3 class="instruction__title">Создайте проект</h3>
        <p class="instruction__subtitle">Заполните простую анкету и опишите идею ремонта Вашей мечты</p>
        <p class="instruction__number">1</p>
        <img class="instruction__illustration" src="./images/mask_group.png">
      </div>
          <!-- -->

      <div class="instruction__block">
        <h3 class="instruction__title">Выберите исполнителя</h3>
        <p class="instruction__subtitle">Найдите подходящего вам профессионала, опираясь на отзывы пользователей и выполненные ранее проекты</p>
        <p class="instruction__number">2</p>
        <img class="instruction__illustration" src="./images/mask_group.png">
      </div>

      <div class="instruction__block">
        <h3 class="instruction__title">Наблюдайте за ходом работ</h3>
        <p class="instruction__subtitle">Согласуйте план-график работ с подрядчиком и наблюдайте за прогрессом дистанционно. Принимайте отчеты в конце каждого этапа в чат</p>
        <p class="instruction__number">3</p>
        <img class="instruction__illustration" src="./images/mask_group.png">
      </div>

      <div class="instruction__block">
        <h3 class="instruction__title">Примите результат</h3>
        <p class="instruction__subtitle">Завершите проект, подписав автоматически собранные документы и наслаждайтесь Вашим уникальным ремонтом!</p>
        <p class="instruction__number">4</p>
        <img class="instruction__illustration" src="./images/mask_group.png">
      </div>
    </div>
    <router-link class="instruction__link" to="/login">Начать работу</router-link>
  </section>

  <section class="advantages">
    <div class="advantages__illustration">
      <img class="fillContainer" src="./images/loyalty.png" alt="иллюстрация преимущества">
    </div>
    <div class="advantages__column">
      <div class="advantages__block">
        <div class="advantages__title">
          Безопасные сделки
        </div>
        <div class="advantages__subtitle">
          Не бойтесь за безопасность проведения финансовых операций. Проводя переводы при помощи встроенных инструментов платформы, вы можете быть уверены, что средства дойдут до исполнителя и работа будет выполнена в срок.
        </div>
      </div>
      <div class="advantages__block">
        <div class="advantages__title">
          Бухгалтерские и юридические услуги
        </div>
        <div class="advantages__subtitle">
          В случае возникновения трудностей в процессе работы. Эксперты платформы  помогут вам решить любые юридические и бухгалтерские вопросы.
        </div>
      </div>
    </div>
    <div class="advantages__column">
      <div class="advantages__block">
        <div class="advantages__title">
          Лицензированные подрядчики
        </div>
        <div class="advantages__subtitle">
          На платформе работают команды профессионалов. Они сделают работу максимально качественно, ведь доказали это на практике и прошли лицензирование сервиса.
        </div>
      </div>
      <div class="advantages__block">
        <div class="advantages__title">
          Медиация
        </div>
        <div class="advantages__subtitle">
          Вы можете обратиться в поддержку в любой непонятной или спорной ситуации. Квалифицированные межиаторы помогут вам решить проблему в любое время суток.
        </div>
      </div>
    </div>
  </section>

  <section class="projects">
    <h2 class="projects__text blockTitle">Проекты, реализованные на платформе</h2>
    <!-- bigger1 занимает две ячейки, bigger2 занимает все три ячейки-->
    <Swiper
      :centered-slides="true"
      class="projects__grids"
      @swiper="swiper => { reviewSwiper = swiper }"
    >
      <SwiperSlide
        class="projects__grid"
        :key="index"
        v-for="(r, index) in reviewList
      ">
        <div class="projects__gridRow ltr">
          <div class="projects__imageHolder large">
            <img class="projects__image projects__image_bigger1" :src="getImgUrl(r.imageName1)">
          </div>
          <div class="projects__imageHolder small">
            <img class="projects__image small" :src="getImgUrl(r.imageName2)">
          </div>
        </div>
  
        <div class="projects__gridRow rtl">
          <div class="projects__block">
            <div class="projects__months">
              <p class="projects__subtitle">Проект выполнен за</p>
               <p class="projects__title">{{ r.time }}</p>
            </div>
            <div class="projects__rectangle"></div>
            <div class="projects__sum">
              <p class="projects__subtitle">Стоимость проекта</p>
              <p class="projects__title">{{ r.coast }} ₽</p>
            </div>
          </div>
    
          <div class="projects__comment-section">
            <div class="projects__profile">
              <img src="./images/projects_photo.svg" class="projects__photo">
              <div class="projects__info">
                <p class="projects__name">{{ r.name }}</p>
                <span class="projects__rating">
                  <img src="./images/projects_star.svg" class="projects__stars">
                  <img src="./images/projects_star.svg" class="projects__stars">
                  <img src="./images/projects_star.svg" class="projects__stars">
                  <img src="./images/projects_star.svg" class="projects__stars">
                  <img src="./images/projects_star.svg" class="projects__stars">
                </span>
              </div>
            </div>
    
            <p class="projects__content">{{ r.comment }}</p>
          </div>
        </div>
      </SwiperSlide>
      <span class="navButton left projects__navButton" @click="reviewBackward">
        <img src="./images/arrowLeft.png"/>
      </span>
      <span class="navButton right projects__navButton" @click="reviewForvard">
        <img src="./images/arrowRight.png"/>
      </span>
    </Swiper>
    <router-link class="projects__link" to="/login">Создать проект</router-link>
  </section>

  <section class="article">
    <div class="article__blocks">
      <h2 class="article__text blockTitle">Полезные статьи о ремонте</h2>
      <Swiper 
        :breakpoints="defaultBreakpoints"
        class="article__articles"
        @swiper="swiper => { articlesSwiper = swiper }"
      >
        <!-- Именование классов конечно не очень... а еще не спрашивай, почему обычный текст в блоках называется subtitle-->
        <!-- Начало секции -->
        <SwiperSlide v-for="(a, index) in articlesList" :key="index">
          <div class="article__block">
            <div class="article__imageHolder">
              <img :src="getImgUrl(a.imageName)" class="article__image">
            </div>
            <div class="article__info">
              <h2 class="article__title">{{ a.title }}</h2>
              <p class="article__subtitle">{{ a.text }}</p>
              <div class="article__controls">
                <div class="article__date">
                  {{ a.date }}
                </div>
                <a class="article__link" :href="a.href">
                  Читать далее ->
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <span class="navButton left article__navButton" @click="articleBackward">
          <img src="./images/arrowLeft.png"/>
        </span>
        <span class="navButton right article__navButton" @click="articleForvard">
          <img src="./images/arrowRight.png"/>
        </span>
      </Swiper>
      <div class="article__buttonBlock">
        <router-link class="article__button" to="/login">Читать больше статей</router-link>
      </div>
    </div>
  </section>

  <section class="ending">
    <div class="ending__title">
      Все, что нужно для ремонта Вашей мечты
    </div>
    <router-link class="ending__button" to="/login">
      Начать работу
    </router-link>
  </section>
</div>
<footer class="footer">
  <div class="footer__appInfo">
    <div class="footer__logo">
      <img src="./images/Logo.png" alt="logo">
    </div>
    <div class="footer__appLinks">
      <a href="" class="footer__link">
        Политика конфиденциальности
      </a>
      <a href="" class="footer__link">
        ТОЧКА РЕМОНТА • 2023
      </a>
    </div>
  </div>
  <div class="footer__links">
    <span @click="goToClassed('search')" class="footer__link">
      Поиск исполнителей
    </span>
    <span @click="goToClassed('notifications')" class="footer__link">
      Уведомления
    </span>
    <span @click="goToClassed('settingsPage')" class="footer__link">
      Профиль
    </span>
    <span @click="goToClassed('myProjects')" class="footer__link">
      Мои проекты
    </span>
    <router-link to="/login" class="footer__link">
      Блог
    </router-link>
  </div>
  <div class="footer__developer">
    <a class="footer__link">
      Контакты разработчиков
    </a>
  </div>
</footer>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue"
import 'swiper/css'
import { UserDataController } from "@/helpers/UserDataController";

export default {
  components: { 
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      role: undefined,
      introSwiper: undefined,
      introList: [
        {title: "Контроль выполнения работ", text: "Наблюдайте за ходом работ дистанционно. Узнавайте о прогрессе выполнения из плана графика, согласованного с исполнителем", imageName: "intro3.png", href: ""},
        {title: "Контроль выполнения работ", text: "Наблюдайте за ходом работ дистанционно. Узнавайте о прогрессе выполнения из плана графика, согласованного с исполнителем", imageName: "intro3.png", href: ""},
        {title: "Контроль выполнения работ", text: "Наблюдайте за ходом работ дистанционно. Узнавайте о прогрессе выполнения из плана графика, согласованного с исполнителем", imageName: "intro3.png", href: ""},
        {title: "Контроль выполнения работ", text: "Наблюдайте за ходом работ дистанционно. Узнавайте о прогрессе выполнения из плана графика, согласованного с исполнителем", imageName: "intro3.png", href: ""},
        {title: "Контроль выполнения работ", text: "Наблюдайте за ходом работ дистанционно. Узнавайте о прогрессе выполнения из плана графика, согласованного с исполнителем", imageName: "intro3.png", href: ""},
      ],
      reviewSwiper: undefined,
      reviewList: [
        {time: "4 Месяца", coast: "600 000", name: "Александр", comment: "Выполнили все максимально качественно и в кратчайшие сроки. Быстро договаривались о всех нюансах, исполнитель оперативно отвечает", imageName1: "projects_image1.png", imageName2: "main_desktop.png"},
        {time: "4 Месяца", coast: "600 000", name: "Александр", comment: "Выполнили все максимально качественно и в кратчайшие сроки. Быстро договаривались о всех нюансах, исполнитель оперативно отвечает", imageName1: "projects_image1.png", imageName2: "main_desktop.png"},
        {time: "4 Месяца", coast: "600 000", name: "Александр", comment: "Выполнили все максимально качественно и в кратчайшие сроки. Быстро договаривались о всех нюансах, исполнитель оперативно отвечает", imageName1: "projects_image1.png", imageName2: "main_desktop.png"},
        {time: "4 Месяца", coast: "600 000", name: "Александр", comment: "Выполнили все максимально качественно и в кратчайшие сроки. Быстро договаривались о всех нюансах, исполнитель оперативно отвечает", imageName1: "projects_image1.png", imageName2: "main_desktop.png"},
      ],
      articlesSwiper: undefined,
      articlesList: [
        {title: "Статья №1", text: "Не бойтесь за безопасность проведения финансовых операций. Проводя переводы при помощи встроенных инструментов платформы, вы можете быть уверены, что средства дойдут до исполнителя и работа будет...", date: "20.09.2020", href: "", imageName: "article_image.png"},
        {title: "Статья №1", text: "Не бойтесь за безопасность проведения финансовых операций. Проводя переводы при помощи встроенных инструментов платформы, вы можете быть уверены, что средства дойдут до исполнителя и работа будет...", date: "20.09.2020", href: "", imageName: "article_image.png"},
        {title: "Статья №1", text: "Не бойтесь за безопасность проведения финансовых операций. Проводя переводы при помощи встроенных инструментов платформы, вы можете быть уверены, что средства дойдут до исполнителя и работа будет...", date: "20.09.2020", href: "", imageName: "article_image.png"},
        {title: "Статья №1", text: "Не бойтесь за безопасность проведения финансовых операций. Проводя переводы при помощи встроенных инструментов платформы, вы можете быть уверены, что средства дойдут до исполнителя и работа будет...", date: "20.09.2020", href: "", imageName: "article_image.png"},
        {title: "Статья №1", text: "Не бойтесь за безопасность проведения финансовых операций. Проводя переводы при помощи встроенных инструментов платформы, вы можете быть уверены, что средства дойдут до исполнителя и работа будет...", date: "20.09.2020", href: "", imageName: "article_image.png"},
        {title: "Статья №1", text: "Не бойтесь за безопасность проведения финансовых операций. Проводя переводы при помощи встроенных инструментов платформы, вы можете быть уверены, что средства дойдут до исполнителя и работа будет...", date: "20.09.2020", href: "", imageName: "article_image.png"},
      ],
      defaultBreakpoints: {
        850: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        500: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        0: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        }
      },
    }
  },
  beforeCreate() {
    document.body.className = "landing"
  },
  methods: {
    introForvard() {
      if (this.introSwiper) this.introSwiper.slideNext()
    },
    introBackward() {
      if (this.introSwiper) this.introSwiper.slidePrev()
    },
    reviewForvard() {
      if (this.reviewSwiper) this.reviewSwiper.slideNext()
    },
    reviewBackward() {
      if (this.reviewSwiper) this.reviewSwiper.slidePrev()
    },
    articleForvard() {
      if (this.articlesSwiper) this.articlesSwiper.slideNext()
    },
    articleBackward() {
      if (this.articlesSwiper) this.articlesSwiper.slidePrev()
    },
    goToClassed(route) {
      if (!this.role) this.$router.push("/login")
      console.log(this.role)
      const prefix = (this.role == 'contractor' ? 'maker' : 'user')
      console.log(`/${prefix}/${route}`)
      this.$router.push(`/${prefix}/${route}`)
    },
    getImgUrl(imageNameWithExtension) {
      return new URL(`./images/${imageNameWithExtension}`, import.meta.url).href;
    }
  },
  mounted() {
    try {
      this.role = JSON.parse(sessionStorage.getItem(UserDataController.sessionStorageKey)).role
    } catch(e) {
      console.log(e)
    }
    document.addEventListener('scroll', event => {
      console.log(window.scrollY)
      if (window.scrollY > 0) {
        this.$refs.header.classList.remove('clear')
        this.$refs.header.classList.add('scrolled')
      } else {
        this.$refs.header.classList.add('clear')
        this.$refs.header.classList.remove('scrolled')
      }
    })
  },
}
</script>

<style scoped>
  @import url(./pages/index.css);
</style>