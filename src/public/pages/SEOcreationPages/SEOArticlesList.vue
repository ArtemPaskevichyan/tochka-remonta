<template>
  <SEOHeader/>
  <div class="SEOArticleListPage headerPage">
    <div class="titleText pageTitle">
      Статьи о ремонте
    </div>
    <div class="SEOArticleListPage__list">
      <SEOArticle 
        v-for="a in articleList" 
        :isLoading="isLoading"
        :key="a.id"
        :title="a.title"
        :text="a.body"
        :date="convertDate(a.publishDate)"
        :imageURL="a.images?.length > 0 ? a.images[0] : undefined"
        @click="$router.push('/seo/article/' + a.id)"
      />
    </div>
    <div class="SEOArticleListPage__caption" v-if="articleList?.length == 0">
      Статей пока не нашлось. Проверьте эту страницу через пару дней.
    </div>
  </div>
</template>

<script>
import SEOArticle from './SEOArticle.vue';
import SEOHeader from './SEOHeader.vue'
import { ArticlesController } from "./helpers/articlesController.js"
import { convertDateToBase } from '@/helpers/DateConverter';

export default {
  components: {
    SEOArticle, SEOHeader,
  },
  data() {
    return {
      viewController: new ArticlesController(),
      isLoading: true,
      articleList: [{}, {}, {}],
    }
  },
  methods: {
    async onMounted() {
      try {
        this.articleList = await this.viewController.getArticlesList()
      } catch(e) {
        console.log("ERROR", this)
      } finally {
        this.isLoading = false
      }
    },
    convertDate(date) {
      return convertDateToBase(date)
    }
  },
  mounted() {
    this.onMounted()
  },
}
</script>