<template>
    <div class="login authorizationHolder">
        <div class="authorizationHolder__titleBlock">
            <div class="titleText">Вход в аккаунт</div>
        </div>
        
        <div class="authorizationHolder__content">
            <div class="login__formBlock">
                <div class="registration__switchHolder">
                    <UISwitch :data="selectionData" @selectedId="(event) => {selectionId = event}"></UISwitch>
                </div>
                <UIInput :title="'Email'" :placeholder="'myemail@mail.ru'"
                v-model:value="email" :style="'small'"></UIInput>
                <UIInput class="lastInput" :title="'Пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" 
                v-model:value="password" :role="'password'" :style="'small'"></UIInput>
                <div class="login__links">
                    <UILink :size="'small'" :link="'/forgotPassword'">Забыли пароль?</UILink>
                    <UILink :size="'small'" :link="'/registration'">Регистрация</UILink>
                </div>
            </div>

            <div class="login__buttonBlock">
                <UIButton @click="sendLogin" class="login__mainButton" :style="buttonStyle">Далее</UIButton>
            </div>

            <div class="login__servicesBlock">
                <div v-if="authServices.length > 0">
                    <div>
                        <hr>или<hr>
                    </div>
                    <div>
                        <span :key="service.id" v-for="service in authServices"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <UILoadingWall v-if="isLoading"></UILoadingWall>
</template>

<script>
import UISwitch from '@/components/FormComponents/UISwitch.vue';
import UIInput from '@/components/FormComponents/UIInput.vue';
import UILink from '@/components/FormComponents/UILink.vue';
import UIButton from '@/components/Buttons/UIButton.vue'
import UILoadingWall from '@/components/UILoadingWall.vue';

import {AuthorizationController} from "@/helpers/AuthorizationController.js"

export default {
    components: {
        UISwitch, UIInput, UILink, UIButton, UILoadingWall,
    },
    data() {
        return {
            selectionData: [
                {id: 0, title: "Ищу ремонт"},
                {id: 1, title: "Сделаем ремонт"},
            ],
            selectionId: 0,
            acceptPP: false,
            authServices: [],
            email: "",
            password: "",
            loginViewModel: new AuthorizationController(),
            isLoading: false,
        }
    },
    methods: {
        async sendLogin() {
            try {
                this.isLoading = true
                await this.loginViewModel.sendLogin(this.email, this.password, this.role)
                this.$router.push("/user/search")
            } catch(error) {
                alert(error)
            } finally {
                this.isLoading = false
            }
        },
    },
    computed: {
        role: function() {
            switch (this.selectionId) {
                case 0:
                    return "customer"
                case 1:
                    return "contractor"
                default:
                    return undefined
            }
        },
        buttonStyle: function() {
            return (this.email == '' || this.password == '') ? 'disabled' : 'primary'
        },
    }
}
</script>

<style>
</style>