<template>
  <div class="SEOArticle">
    <div class="SEOArticle__image">
        <img :src="image" alt="article avatar">
      </div>
    <div class="SEOArticle__info">
      <div class="SEOArticle__title">
        {{ title }}
      </div>
      <div class="SEOArticle__text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
import { serverURL } from "@/preferenses.js";

export default {
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    }
  },
  computed: {
    image: function() {
      return `${serverURL}/api/v1/blog/get_image?filename=${this.imageURL}`
    }
  }
}
</script>