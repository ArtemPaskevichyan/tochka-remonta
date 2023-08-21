<template>
  <div class="headerPage iframePage">
    <UIHeader></UIHeader>
    <iframe
      id="chat"
      ref="chat"
      src="https://chat.tochka-remonta.site?layout=embedded"
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
        this.$router.push("/login")
        return
      }
      
      const chat = this.$refs.chat
      chat.contentWindow.postMessage({
        externalCommand: "login-with-token",
        token: authToken,
      }, "*")
      
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
      return response?.data?.authToken
    }
  },
  mounted() {
    this.onMounted()
  }
}
</script>
