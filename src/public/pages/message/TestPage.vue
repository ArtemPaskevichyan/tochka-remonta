<template>
  <div class="headerPage iframePage">
    <UIHeader></UIHeader>
    <iframe id="chat" src="https://chat.tochka-remonta.site?layout=embedded" frameborder="0">
    </iframe>
  </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue'
import axios from 'axios'

export default {
  components: {
    UIHeader,
  },
  data() {
    return {}
  },
  methods: {
    async onMounted() {
      axios.post("https://chat.tochka-remonta.site/api/v1/login", {
        user: "new-user",
        password: "new-users-passw0rd",
      })
      .then((response) => {
        console.log("CHAT RESPONSE", response)
      })
      .catch((error) => {
        console.log("CHAT ERROR", error)
      })
    }
  },
  mounted() {
    this.onMounted()
  }
}
</script>
