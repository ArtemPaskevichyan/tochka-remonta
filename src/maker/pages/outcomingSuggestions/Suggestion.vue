<template>
  <div class="ocSuggestion" :class="{skeleton: isLoading}">
    <div class="ocSuggestion__text">
      Вы предложили себя на 
      роль исполнителя проекта <UILink v-if="project?.id" :link="`/maker/project/${project?.id}`">{{ project?.title }}</UILink>
    </div>
    <div class="ocSuggestion__info">
      <div class="ocSuggestion__picture">
        <div class="ocSuggestion__image ocSuggestion__makerAvatar" @click="$router.push(`/user/makerPage/${maker?.uuid}`)">
          <img :src="avatarURL" alt="">
        </div>
        <i class="icon-arrow-right"></i>
        <div class="ocSuggestion__image ocSuggestion__projectAvatar" @click="$router.push(`/maker/project/${project?.id}`)">
          <img :src="imageURL" alt="">
        </div>
      </div>
      <div class="ocSuggestion__controls">
        <UIButton :style="'destructive'" @click="deleteRequest">Отозвать заявку</UIButton>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import UILink from '@/components/FormComponents/UILink.vue'
import { TokenHandler } from "@/helpers/TokenHandler.js";
import { serverURL } from "@/preferenses.js"
import UIButton from "@/components/Buttons/UIButton.vue";

export default {
  components: {
    UILink, UIButton,
  },
  data() {
    return {
      isLoading: false,
      maker: undefined,
      project: undefined,
      avatarBaseURL: `${serverURL}/api/v1/auth/get_avatar?filename=`,
      imageBaseURL: `${serverURL}/api/v1/projects/get_event_photo?filename=`,
    }
  },
  props: {
    to: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
  },
  methods: {
    async onMounted() {
      this.getMakerInfo()
      this.getProjectInfo()
    },

    async getMakerInfo() {
      if (!this.from) return
      const URL = `${serverURL}/api/v1/auth/get_user_data?user_uuid=${this.from}`
      this.maker = (await axios.get(URL))?.data?.user
    },

    async getProjectInfo() {
      if (!this.projectId) return
      const URL = `${serverURL}/api/v1/projects/get_project?p_id=${this.projectId}`
      this.project = (await axios.get(URL))?.data?.project
    },

    async deleteRequest() {
      const token = await TokenHandler.shared.getToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const URL = `${serverURL}/api/v1/projects/delete_join_request?p_id=${this.projectId}&to_user=${this.to}`
      axios.get(URL, config)
        .then((response) => {
          this.$emit("deleted")
        })
    },
  },
  mounted() {
    this.onMounted()
  },
  computed: {
    avatarURL() {
      return this.maker?.avatar ? this.avatarBaseURL + this.maker?.avatar : ""
    },
    imageURL() {
      return this.project?.main_picture ? this.imageBaseURL + this.project?.main_picture : ""
    },
  }
}
</script>