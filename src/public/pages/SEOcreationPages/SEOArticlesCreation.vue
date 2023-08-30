<template>
  <div class="headerPage SEOArticleCreation backgroundCard">
    <SEOHeader/>
    <div class="titleText">
      Создание статьи
    </div>

    <UIImageLoader :title="'Фото статьи'" v-model:imageSrc="imageSrc" @fileLoaded="handleFile"/>
    <UIInput :placeholder="'Название статьи'" v-model:value="title"/>
    <UITextInput :placeholder="'Текст статьи...'" v-model:value="text"/>
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

export default {
  components: {
    UIInput, UIImageLoader, UITextInput, UIButton, SEOHeader, UIAlert,
  },
  data() {
    return {
      viewController: new ArticlesController(),
      text: "",
      title: "",
      imageSrc: "",
      image: undefined,
      isAlertOpened: false,
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
      this.viewController.addArticle({
        text: this.text,
        title: this.title,
        image: this.image,
      })
        .then((response) => {
          console.log("RESP", response)
        })
        .catch((error) => {
          console.log("ERROR", error)
        })
    },
    callError(title, text, buttons) {
      this.isAlertOpened = true
      this.errorToAlert.title = title
      this.errorToAlert.text = text
      this.errorToAlert.buttons = buttons
    },
  },
  
}
</script>

