<template>
  <div class="citySelect">
    <div class="citySelect__input">
      <UIInput v-model:value="text" :placeholder="'Москва'" :title="'Населенный пункт'"/>
    </div>
    <div class="citySelect__variants">
      <div
      v-for="variant in variants"
      class="citySelect__variant"
      :key="variant.id"
      @click="choose(variant.title)"
      >
        <div class="citySelect__variantTitle">
          {{ variant.title }}
        </div>
        <div class="citySelect__variantSubtitle">
          {{ variant.region }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIInput from '@components/FormComponents/UIInput.vue'
import axios from 'axios'

export default {
  components: {
    UIInput,
  },
  data() {
    return {
      variants: [],
      text: '',
    }
  },
  methods: {
    makeSearch() {
      const URL = `https://api.vk.com/method/database.getCities?country_id=1&count=30&access_token=7022df147022df147022df14e17337f2ac770227022df1414ebfd1a796d1171793de127&v=5.131&q=${this.text.trim()}`
      axios.get(URL)
        .then((response) => {
          console.log("RESP", response)
          this.variants = response.data
        })
        .catch((error) => {
          console.log("ERROR", error)
        })
    },
    choose(title) {
      this.$emit("selected", title)
    }
  },
  watch: {
    text() {
      this.makeSearch()
    }
  }
}
</script>

