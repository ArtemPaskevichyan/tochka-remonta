<template>
    <div class="login authorizationHolder">
        <div class="login__titleBlock">
            <div class="titleText">Вход в аккаунт</div>
        </div>
        
        <div class="authorizationHolder__content">
            <div class="login__formBlock">
                <div class="registration__switchHolder">
                    <UISwitch :data="selectionData" @selectedId="(event) => {selectionId = event}"></UISwitch>
                </div>
                <UIInput :title="'Email'" :placeholder="'myemail@mail.ru'" v-model:value="email"></UIInput>
                <UIInput class="lastInput" :title="'Пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" v-model:value="password" :role="'password'"></UIInput>
                <div class="login__links">
                    <UILink :size="'small'" :link="'/forgotPassword'">Забыли пароль?</UILink>
                    <UILink :size="'small'" :link="'/registration'">Регистрация</UILink>
                </div>
            </div>

            <div class="login__buttonBlock">
                <UIButton @click="sendLogin" :style="'primary'">Далее</UIButton>
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
</template>

<script>
import UISwitch from '@/components/FormComponents/UISwitch.vue';
import UIInput from '@/components/FormComponents/UIInput.vue';
import UILink from '@/components/FormComponents/UILink.vue';
import UIButton from '@/components/Buttons/UIButton.vue'

import {AuthorizationController} from "@/helpers/AuthorizationController.js"

export default {
    components: {
        UISwitch, UIInput, UILink, UIButton,
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
        }
    },
    methods: {
        sendLogin() {
            this.loginViewModel.sendLogin(this.email, this.password, this.role)
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
        }
    }
}
</script>

<style>
</style>