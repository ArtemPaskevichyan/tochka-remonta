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
        <div v-if="variant.region" class="citySelect__variantSubtitle">
          {{ variant.region }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIInput from '@/components/FormComponents/UIInput.vue'
import axios from 'axios'


const DEFAULT_CITIES = [{"id":1,"title":"Москва","important":1},{"id":2,"title":"Санкт-Петербург","important":1},{"id":10,"title":"Волгоград"},{"id":37,"title":"Владивосток"},{"id":42,"title":"Воронеж"},{"id":49,"title":"Екатеринбург"},{"id":60,"title":"Казань"},{"id":61,"title":"Калининград"},{"id":72,"title":"Краснодар"},{"id":73,"title":"Красноярск"},{"id":95,"title":"Нижний Новгород"},{"id":99,"title":"Новосибирск"},{"id":104,"title":"Омск"},{"id":110,"title":"Пермь"},{"id":119,"title":"Ростов-на-Дону"},{"id":123,"title":"Самара"},{"id":151,"title":"Уфа"},{"id":153,"title":"Хабаровск"},{"id":158,"title":"Челябинск"},{"id":185,"title":"Севастополь"},{"id":627,"title":"Симферополь"}]

export default {
  components: {
    UIInput,
  },
  data() {
    return {
      variants: DEFAULT_CITIES,
      text: '',
    }
  },
  methods: {
    makeSearch() {
      const URL = `https://api.tochka-remonta.site/api/v1/auth/get_cities?q=${this.text.trim()}`
      axios.get(URL)
        .then((response) => {
          this.variants = response.data?.cities?.response?.items ?? DEFAULT_CITIES
        })
        .catch((error) => {
          this.variants = DEFAULT_CITIES
        })
    },
    choose(title) {
      this.$emit("selected", title)
    }
  },
  watch: {
    text(_, newValue) {
      if (newValue == "") {
        this.variants = DEFAULT_CITIES
      }
      this.makeSearch()
    }
  }
}
</script>

