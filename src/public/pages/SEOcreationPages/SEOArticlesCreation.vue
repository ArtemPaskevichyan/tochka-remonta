<template>
  <div class="headerPage SEOArticleCreation">
    <div class="titleText">
      Создание статьи
    </div>

    <UIImageLoader :title="'Фото статьи'" v-model:imageSrc="imageSrc" @fileLoaded="handleFile"/>
    <UIInput :placeholder="'Название статьи'" v-model:value="title"/>
    <UITextInput :placeholder="'Текст статьи...'" v-model:value="text"/>
    <UIButton :style="'primary'" @click="createArticle">Добавить статью</UIButton>
  </div>
</template>

<script>
import UIInput from "@/components/FormComponents/UIInput.vue";
import UITextInput from '@/components/FormComponents/UITextInput.vue';
import UIImageLoader from '@/components/FormComponents/ImageLoaders/UIImageLoader.vue';
import UIButton from "@/components/Buttons/UIButton.vue";
import { ArticlesController } from './helpers/articlesController.js'

export default {
  components: {
    UIInput, UIImageLoader, UITextInput, UIButton,
  },
  data() {
    return {
      viewController: new ArticlesController(),
      text: "",
      title: "",
      imageSrc: "",
      image: undefined,
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
          // this.$router.push('/seo/articles')
        })
    }
  },
  
}
</script>

