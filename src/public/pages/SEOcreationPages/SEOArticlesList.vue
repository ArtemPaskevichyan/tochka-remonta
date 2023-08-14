<template>
  <div class="SEOArticleListPage headerPage">
    <div class="titleText">
      Статьи о ремонте
    </div>
    <div class="SEOArticleListPage__list">
      <SEOArticle 
        v-for="a in articleList" 
        :class="{skeleton: isLoading}"
        :key="a.id"
        :title="a.title"
        :text="a.body"
        :imageURL="a.images?.length > 0 ? a.images[0] : undefined"
      />
    </div>
    <div class="SEOArticleListPage__caption">
      Статей пока не нашлось. Проверьте эту страницу через пару дней.
    </div>
  </div>
</template>

<script>
import SEOArticle from './SEOArticle.vue';
import { ArticlesController } from "./helpers/articlesController.js"

export default {
  components: {
    SEOArticle,
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
  },
  mounted() {
    this.onMounted()
  },
}
</script>