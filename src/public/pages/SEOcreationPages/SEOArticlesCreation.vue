<template>
  <div class="headerPage">
    <SEOHeader/>
    
    <div class="titleText pageTitle">
      Создание статьи
    </div>
    <div class="backgroundCard SEOArticleCreation">
      <UIImageLoader :title="'Фото статьи'" v-model:imageSrc="imageSrc" @fileLoaded="handleFile"/>
      <UIInput :placeholder="'Название статьи'" v-model:value="title"/>
      <UITextInput :placeholder="'Текст статьи...'" v-model:value="text"/>
      <UIInput :placeholder="'Имя автора'" v-model:value="author"/>
      <div class="addButton__holder">
        <UIButton class="addButton" :style="'primary'" @click="createArticle">Добавить статью</UIButton>
      </div>

      <UIAlert v-if="isAlertOpened" v-model:isOpened="isAlertOpened">
        <template v-slot:body>
            <div class="alert__baseTitle" v-if="errorToAlert?.title">
                {{errorToAlert?.title}}
            </div>
            <div class="alert__baseText" v-if="errorToAlert?.text">
                {{errorToAlert?.text}}
            </div>
        </template>
        <template v-slot:controls>
            <UIButton :style="b?.style" @click="b?.callback" :key="index" v-for="(b, index) in errorToAlert?.buttons">{{ b?.label }}</UIButton>
        </template>
      </UIAlert>

      <UILoadingWall v-if="isLoading"/>
    </div>
  </div>
</template>

<script>
import UIInput from "@/components/FormComponents/UIInput.vue";
import UITextInput from '@/components/FormComponents/UITextInput.vue';
import UIImageLoader from '@/components/FormComponents/ImageLoaders/UIImageLoader.vue';
import UIButton from "@/components/Buttons/UIButton.vue";
import SEOHeader from "./SEOHeader.vue";
import { ArticlesController } from './helpers/articlesController.js'
import UIAlert from "@/components/UIAlert.vue";
import UILoadingWall from '@/components/UILoadingWall.vue';

export default {
  components: {
    UIInput, UIImageLoader, UITextInput, UIButton, SEOHeader, UIAlert, UILoadingWall,
  },
  data() {
    return {
      viewController: new ArticlesController(),
      text: "",
      title: "",
      imageSrc: "",
      author: "",
      image: undefined,
      isAlertOpened: false,
      isLoading: false,
      errorToAlert: {
        buttons: [],
        title: "",
        text: "",
      },
    }
  },
  methods: {
    handleFile(file) {
      this.image = file
    },
    async createArticle() {
      try {
        this.isLoading = true
        const resp = await this.viewController.addArticle({
          text: this.text,
          title: this.title,
          image: this.image,
          author: this.author,
        })
        console.log("RESP", resp)
        this.$router.push("/seo/articles")
      } catch(e) {
        console.log("Error", e)
        switch (e?.response?.data?.msg) {
          case "empty fields":
            this.callError("Пустые поля", "Заполните название статьи, ее текст и имя автора, чтобы опубликовать её", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
            break;
          case "access denied":
            this.$router.push("/seo/login")
            break;
          case "database error":
            this.callError("Ошибка сервера", "На сайте возникла непредвиденная ошибка, повторите попытку позже", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
            break;
          case "error with upload files":
            this.callError("Некорректные файлы", "В загруженных вами файлах обнаружена ошибка. Вероятнее всего, ваш файл весит слишком много", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
            break;
          case "Invalid or expired JWT":
            this.$router.push("/seo/login")
          default:
            this.callError("Непредвиденная ошибка", "На сайте возникла непредвиденная ошибка, повторите попытку позже", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
            break;
        }
      } finally {
        this.isLoading = false
      }
    },
    callError(title, text, buttons) {
      this.isAlertOpened = true
      this.errorToAlert.title = title
      this.errorToAlert.text = text
      this.errorToAlert.buttons = buttons
    },
  },
  mounted() {
    this.viewController.checkToken()
  }
}
</script>

