<template>
  <SEOHeader/>
  <div class="SEOArticlePage headerPage backgroundCard">
    <div class="SEOArticlePage__title">
      {{ model?.title ?? "Не обнаружен" }}
    </div>
    <div class="SEOArticlePage__image">
      <img v-if="model?.images?.length > 0" :src="image(model?.images[0])" alt="article avatar">
    </div>
    <div class="SEOArticlePage__text">
      {{ model?.body ?? "Не обнаружен"}}
    </div>

    <div class="SEOArticlePage__info">
      <div class="SEOArticlePage__name">
        {{ model.author }}
      </div>
      <div class="SEOArticlePage__date">
        {{ getDate(model?.publishDate) }}
      </div>
    </div>
  </div>
</template>

<script>
import { serverURL } from "@/preferenses.js";
import { ArticlesController } from "./helpers/articlesController";
import { convertDateToBase } from '@/helpers/DateConverter';
import SEOHeader from "./SEOHeader.vue";

export default {
  components: {
    SEOHeader,
  },
  data() {
    return {
      articleController: new ArticlesController(),
      model: {},
    }
  },
  props: {
    id: {
      required: true,
      type: Number,
    }
  },
  methods: {
    async onMounted() {
      try {
        this.model = await this.articleController.getArticle(this.id)
      } catch(e) {
        console.log(e)
      }
    },
    image: function(img) {
      return `${serverURL}/api/v1/blog/get_image?filename=${img}`
    },
    getDate(date) {
      return convertDateToBase(date)
    }
  },
  mounted() {
    this.onMounted()
  },
}
</script>