import { createApp } from 'vue'
import { serverURL } from '@/preferenses'
import App from './App.vue'
import router from './router'

const app = createApp(App)

console.log("router in index")
console.log(serverURL)
console.log(router)
app.use(router)

app.mount('#app')