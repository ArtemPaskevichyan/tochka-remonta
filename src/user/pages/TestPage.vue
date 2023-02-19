<template>
    <div>
        <h1 class="loading" :class="{ skeleton: isDataLoading }">Test page</h1>
    </div>
    <div class="loading" :class="{ skeleton: isDataLoading }" v-if="isDataLoading">Loading...</div>
</template>

<script>
import { LoginManager } from "./helpers/loginManager.js"

export default {
    data() {
        return {
            isDataLoading: false,
            loginManager: new LoginManager(),
        }
    },
    methods: {
        async registerUser() {
            this.isDataLoading = true
            await this.loginManager.registration("string", "string", "string")
            this.isDataLoading = false
        },
    },
    mounted() {
        this.registerUser()
    }
}
</script>

<style>
</style>