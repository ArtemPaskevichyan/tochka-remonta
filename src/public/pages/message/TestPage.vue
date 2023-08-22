<template>
  <div class="headerPage iframePage">
    <UIHeader></UIHeader>
    <iframe
      id="chat"
      ref="chat"
      src="https://chat.tochka-remonta.site/?layout=embedded"
      frameborder="0"
    >
    </iframe>
  </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue'
import axios from 'axios'
import { TokenHandler } from "@/helpers/TokenHandler.js";
import { serverURL } from "@/preferenses.js";

export default {
  components: {
    UIHeader,
  },
  data() {
    return {}
  },
  methods: {
    async onMounted() {
      let authToken
      try {
        authToken = await this.getAuthToken()
      } catch(e) {
        console.log("ERROR CHAT", e)
        this.$router.push("/login")
        return
      }

      axios.post("https://chat.tochka-remonta.site/api/v1/login")
      .then((repsonse) => {
        const chat = this.$refs.chat
        chat.contentWindow.postMessage({
          externalCommand: "logout",
        }, "https://chat.tochka-remonta.site")
        chat.contentWindow.postMessage({
          externalCommand: "login-with-token",
          token: authToken,
        }, "https://chat.tochka-remonta.site")
        chat.contentWindow.postMessage({
          externalCommand: "go",
          path: "/channel/general",
        }, "https://chat.tochka-remonta.site")
      })
      
      // console.log("Stage 1", authToken)
      

      // console.log("Stage 2")

      // chat.contentWindow.postMessage({
      //   externalCommand: 'go',
      //   path: '/admin/General'
      // }, '*')
      // axios.post("https://chat.tochka-remonta.site/api/v1/login", {
      //   user: "new-user",
      //   password: "new-users-passw0rd",
      // })
      // .then((response) => {
      //   console.log("CHAT RESPONSE", response)
      // })
      // .catch((error) => {
      //   console.log("CHAT ERROR", error)
      // })
    },

    async getAuthToken() {
      const token = await TokenHandler.shared.getToken()
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
      const URL = `${serverURL}/api/v1/auth/get_chat_token`

      const response = await axios.get(URL, config)
      console.log(response)
      return response?.data?.authToken
    }
  },
  mounted() {
    this.onMounted()
  }
}
</script>
