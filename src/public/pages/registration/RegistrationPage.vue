<template>
    <div class="registration authorizationHolder">
        <div class="authorizationHolder__titleBlock">
            <div class="titleText">Добро пожаловать!</div>
            <div class="largeText">Регистрация</div>
        </div>

        
        <div class="authorizationHolder__content">
            <div class="registration__formBlock">
                <div class="registration__switchHolder">
                    <UISwitch :data="selectionData" @selectedId="(event) => {selectionId = event}"></UISwitch>
                </div>
                <UIInput :title="'Email'" :placeholder="'myemail@mail.ru'" 
                v-model:value="email" :style="'small'"></UIInput>
                <UIInput :title="'Пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" 
                v-model:value="password1" :role="'password'" :style="'small'"></UIInput>
                <UIInput :title="'Повторите пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" 
                v-model:value="password2" :role="'password'" :style="'small'"></UIInput>
            </div>
    
            
            <div class="registration__buttonBlock">
                <UICheckbox v-model:value="acceptPP" :style="'small'">Я принимаю <UILink :link="'/privacyPolicy'">политику конфиденциальности</UILink></UICheckbox>
                <UIButton class="registration__mainButton" @click="sendRegistration" :style="buttonStyle">Далее</UIButton>
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
            <span>Уже есть аккаунт?  <UILink :size="'small'" :link="'/login'">Войти</UILink></span>
        </div>
    </div>
    <UILoadingWall v-if="isLoading"></UILoadingWall>
</template>

<script>
import UILink from '@/components/FormComponents/UILink.vue';
import UISwitch from '@/components/FormComponents/UISwitch.vue';
import UIInput from '@/components/FormComponents/UIInput.vue'
import UICheckbox from '@/components/FormComponents/UICheckbox.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UILoadingWall from '@/components/UILoadingWall.vue';

import {AuthorizationController} from "@/helpers/AuthorizationController.js"
import { createError, ERROR_CODES} from "@/helpers/ErrorMaker.js"

export default {
    components: {
        UISwitch, UIInput, UILink, UICheckbox, UIButton, UILoadingWall, 
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
            isLoading: false,
        }
    },
    methods: {
        async sendRegistration() {
            try {
                if (!this.acceptPP) { throw createError("Accept Privacy Policy", ERROR_CODES.privacyPolicyError) }
                this.isLoading = true
                await this.registrationViewModel.sendRegistration(this.email, this.password1, this.password2, this.role)
                this.$router.push({ name: "checkEmail", params: {
                    email: this.email,
                }})
            } catch(error) {
                alert(error.message)
            } finally {
                this.isLoading = false
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
        },
        buttonStyle: function() {
            return (this.email == '' || this.password1 == '' || this.password2 == '' || !this.acceptPP) ? 'disabled' : 'primary'
        },
    }
}
</script>

<style>

</style>