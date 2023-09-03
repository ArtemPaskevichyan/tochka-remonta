<template>
  <div class="headerPage outcomingSuggestions tabBarPage">
    <UIHeader/>
    <UITabBar :page="'Мои проекты'"/>
    <div class="titleText pageTitle">Исходящие заявки</div>
    <div class="outcomingSuggestions__list">
      <Suggestion
        v-for="s in suggestionsArray"
        :key="s.id"
        :to="s.to"
        :projectId="s.project_id"
        :suspense="s.suspense ?? false"
        @deleted="deleteSuggestion(s.id)"
      />
      <div class="outcomingSuggestions__caption" v-if="suggestionsArray?.length == 0">
        Заявок, отпраленных вами, не найдено
        <UIButton :style="'primary'" @click="$router.push('/user/search')"><i class="icon-search inline-icon m-r"></i>Поиск исполнителей</UIButton>
      </div>
    </div>
    <UITabBar :page="'Мои проекты'"/>
  </div>
</template>

<script>
import Suggestion from "./Suggestion.vue"
import { OutcomingSuggestionsController } from "./helpers/outcomingSuggestionsController.js"
import UIHeader from '@/components/Header/UIHeader.vue'
import UITabBar from '@/components/UITabBar.vue'
import UIButton from "@/components/Buttons/UIButton.vue"

export default {
  components: {
    Suggestion, UIHeader, UITabBar, UIButton,
  },
  data() {
    return {
      suggestionsArray: [{suspense: true}, {suspense: true}, {suspense: true}],
      viewController: new OutcomingSuggestionsController()
    }
  },
  methods: {
    async onMounted() {
      try {
        this.suggestionsArray = await this.viewController.getSuggestions()
        console.log(this.suggestionsArray)
      } catch(e) {
        console.log("ERROR", e)
      } finally {

      }
    },

    deleteSuggestion(id) {
      this.suggestionsArray = this.suggestionsArray.filter(e => e.id != id)
    }
  },
  mounted() {
    this.onMounted()
  }
}
</script>