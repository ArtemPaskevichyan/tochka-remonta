import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

console.log("router in index")
app.use(router)

app.mount('#app')
