<template>
  <div class="headerPage outcomingSuggestions tabBarPage">
    <UIHeader/>
    <div class="titleText pageTitle">Исходящие заявки</div>
    <div class="outcomingSuggestions__list">
      <Suggestion v-for="s in suggestionsArray" :key="s.id" :to="s.to" :projectId="s.project_id" :from="s.from" @deleted="deleteSuggestion(s.id)"/>
      <div class="outcomingSuggestions__caption" v-if="suggestionsArray?.length == 0">
        Заявок, отпраленных вами не найдено
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

export default {
  components: {
    Suggestion, UIHeader, UITabBar,
  },
  data() {
    return {
      suggestionsArray: [{}, {}, {}],
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