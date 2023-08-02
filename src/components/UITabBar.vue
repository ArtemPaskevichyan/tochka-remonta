<template>
  <div class="tabBar">
    <div v-if="isLoaded" class="tabBar__inner">
      <div class="tabBar__page"
      :class="{active: tab.active}"
      v-for="tab in tabs" :key="tab.id"
      @click="$router.push({name: tab.destination})"
      >
        <div class="tabBar__icon">
          <i :class="tab.iconClass"></i>
        </div>
        <div class="tabBar__label">
          {{ tab.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UserDataController } from '@/helpers/UserDataController.js'

export default {
  data() {
    return {
      isLoaded: false,
      tabs: {

      },
    }
  },
  props: {
    page: {
      required: false,
      type: String,
    }
  },
  methods: {
    async onMounted() {
      let data = await UserDataController.shared.getData()
      this.isLoaded = true

      if (data.role == "customer") {
        this.tabs = [
          {id: 0, active: false, iconClass: "icon-search", label: "Поиск", destination: "userSearch"},
          {id: 1, active: false, iconClass: "icon-cards", label: "Мои проекты", destination: "userMyProjects"},
          {id: 2, active: false, iconClass: "icon-plus", label: "Новый проект", destination: "userCreateProject"},
          {id: 3, active: false, iconClass: "icon-bell", label: "Уведомления", destination: "userNotifications"},
          {id: 4, active: false, iconClass: "icon-person-plus", label: "Профиль", destination: "userSettingsPage"},
        ]
      } else if (data.role == "contractor") {
        this.tabs = [
          {id: 0, active: false, iconClass: "icon-search", label: "Поиск", destination: "makerSearch"},
          {id: 1, active: false, iconClass: "icon-cards", label: "Мои проекты", destination: "makerMyProjects"},
          {id: 2, active: false, iconClass: "icon-plus", label: "Новый проект", destination: "makerCreateProject"},
          {id: 3, active: false, iconClass: "icon-bell", label: "Уведомления", destination: "makerNotifications"},
          {id: 4, active: false, iconClass: "icon-person-plus", label: "Профиль", destination: "makerSettingsPage"},
        ]
      }

      for (let el of this.tabs) {
        console.log(el, this.page)
        if (el.label == this.page) {
          el.active = true
          break
        }
      }
    }
  },
  mounted() {
    this.onMounted()
  },
}
</script>