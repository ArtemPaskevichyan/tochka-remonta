<template>
    <div class="registration authorizationHolder">
        <div class="registration__titleBlock">
            <div class="titleText">Добро пожаловать!</div>
            <div class="largeText">Регистрация</div>
        </div>

        
        <div class="authorizationHolder__content">
            <div class="registration__formBlock">
                <div class="registration__switchHolder">
                    <UISwitch :data="selectionData" @selectedId="(event) => {selectionId = event}"></UISwitch>
                </div>
                <UIInput :title="'Email'" :placeholder="'myemail@mail.ru'" v-model:value="email"></UIInput>
                <UIInput :title="'Пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" v-model:value="password1" :role="'password'"></UIInput>
                <UIInput :title="'Повторите пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" v-model:value="password2" :role="'password'"></UIInput>
            </div>
    
            
            <div class="registration__buttonBlock">
                <UICheckbox v-model:value="acceptPP">Я принимаю <UILink :link="'/privacyPolicy'">политику конфиденциальности</UILink></UICheckbox>
                <UIButton @click="sendRegistration" :style="'primary'">Далее</UIButton>
            </div>
    
            
            <div class="registartion__servicesBlock">
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

        <div class="registration__loginBlock">
            <span>Уже есть аккаунт?  <UILink :link="'/login'">Войти</UILink></span>
        </div>
    </div>
</template>

<script>
import UILink from '@/components/FormComponents/UILink.vue';
import UISwitch from '@/components/FormComponents/UISwitch.vue';
import UIInput from '@/components/FormComponents/UIInput.vue'
import UICheckbox from '@/components/FormComponents/UICheckbox.vue';
import UIButton from '@/components/Buttons/UIButton.vue';

import {AuthorizationController} from "@/helpers/AuthorizationController.js"
import { createError, ERROR_CODES} from "@/helpers/ErrorMaker.js"

export default {
    components: {
        UISwitch, UIInput, UILink, UICheckbox, UIButton,
    },
    data() {
        return {
            registrationViewModel: new AuthorizationController(),
            selectionData: [
                {id: 0, title: "Ищу ремонт"},
                {id: 1, title: "Сделаем ремонт"},
            ],
            selectionId: 0,
            email: "",
            password1: "",
            password2: "",
            acceptPP: false,
            authServices: [],
        }
    },
    methods: {
        async sendRegistration() {
            try {
                await this.registrationViewModel.sendRegistration(this.email, this.password1, this.password2, this.role)
                if (!this.acceptPP) { throw createError("Accept Privacy Policy") }
            } catch(error) {
                alert(error.message)
            } 
        }
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