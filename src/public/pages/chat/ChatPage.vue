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
    return {
      iframeLoaded: false,
    }
  },
  methods: {
    async onMounted() {
      console.log("MOUNTED")
      await axios.post("https://chat.tochka-remonta.site/api/v1/login")
      .then((repsonse) => {
      })
      .catch((error) => {
        console.log("CHAT LOGIN ERROR", error)
      })

      if (!this.iframeLoaded) {
        this.$refs.chat.onload = () => {
          this.iframeLoaded = true
          this.iframeConfigCommands() 
          this.handleCommands()
        }
      } else {
        this.iframeConfigCommands() 
        this.handleCommands()
      }
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
    },

    async iframeConfigCommands() {
      let authToken
      try {
        authToken = await this.getAuthToken()
      } catch(e) {
        console.log("ERROR CHAT", e)
        this.$router.push("/login")
        return
      }

      const chat = this.$refs.chat
      // chat.contentWindow.postMessage({
      //   externalCommand: "logout",
      // }, "https://chat.tochka-remonta.site")
      chat.contentWindow.postMessage({
        externalCommand: "login-with-token",
        token: authToken,
      }, "https://chat.tochka-remonta.site")
    },

    handleCommands() {
      const command = this.$route.query.command
      const chat = this.$refs.chat

      let message = {}
      switch (command) {
        case "go":
          message = {
            externalCommand: command,
            path: this.$route.query.value ?? ""
          }
          break;
      }

      chat.contentWindow.postMessage(message, "https://chat.tochka-remonta.site")
    }
  },
  mounted() {
    this.$refs.chat.onload = () => {
      this.iframeLoaded = true
    }
    this.onMounted()
  }
}
</script>
