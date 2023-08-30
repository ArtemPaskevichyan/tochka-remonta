<template>
  <div class="SEOArticle">
    <div class="SEOArticle__image" :class="{skeleton: isLoading}">
        <img v-if="imageURL" :src="image" alt="article avatar">
      </div>
    <div class="SEOArticle__info">
      <div class="SEOArticle__title" :class="{skeleton: isLoading}">
        {{ title ?? "Some article title" }}
      </div>
      <div class="SEOArticle__text" :class="{skeleton: isLoading}">
        {{ text ?? "some text here" }}
      </div>
      <div class="SEOArticle__date" :class="{skeleton: isLoading}">
        {{ date ?? "00:00:0000" }}
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
    },
    date: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  computed: {
    image: function() {
      return `${serverURL}/api/v1/blog/get_image?filename=${this.imageURL}`
    }
  }
}
</script>