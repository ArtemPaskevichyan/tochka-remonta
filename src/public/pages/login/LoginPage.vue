<template>
    <div class="login authorizationHolder">
        <div class="authorizationHolder__titleBlock">
            <div class="titleText">Вход в аккаунт</div>
        </div>
        
        <div class="authorizationHolder__content">
            <div class="login__formBlock">
                <div class="registration__switchHolder">
                </div>
                <UIInput :title="'Email'" :placeholder="'myemail@mail.ru'" :class="{error: emailError}"
                v-model:value="email" :style="'small'"></UIInput>
                <UIInput class="lastInput" :title="'Пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" :class="{error: passwordError}"
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
    <UIAlert v-if="isAlertOpened" v-model:isOpened="isAlertOpened">
        <template v-slot:body>
            <div class="alert__baseTitle" v-if="errorToAlert?.title">
                {{errorToAlert?.title}}
            </div>
            <div class="alert__baseText" v-if="errorToAlert?.text">
                {{errorToAlert?.text}}
            </div>
        </template>
        <template v-slot:controls>
            <UIButton :style="b?.style" @click="b?.callback" :key="index" v-for="(b, index) in errorToAlert?.buttons">{{ b?.label }}</UIButton>
        </template>
    </UIAlert>
</template>

<script>
import UISwitch from '@/components/FormComponents/UISwitch.vue';
import UIInput from '@/components/FormComponents/UIInput.vue';
import UILink from '@/components/FormComponents/UILink.vue';
import UIButton from '@/components/Buttons/UIButton.vue'
import UILoadingWall from '@/components/UILoadingWall.vue';
import UIAlert from '@/components/UIAlert.vue';

import {AuthorizationController} from "@/helpers/AuthorizationController.js"

export default {
    components: {
        UISwitch, UIInput, UILink, UIButton, UILoadingWall, UIAlert,
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
            isAlertOpened: false,
            errorToAlert: {
                buttons: [],
                title: "",
                text: "",
            },

            emailError: false,
            passwordError: false,
        }
    },
    methods: {
        async sendLogin() {
            try {
                this.isLoading = true
                await this.loginViewModel.sendLogin(this.email, this.password, this.role)
                this.$router.push(await this.loginViewModel.getAfterLoginURL())
            } catch(error) {
                console.log("COMMING ERROR", error)
                switch(error?.message) {
                    case "email or password is empty":
                        this.callError("Не заполненные поля", "Не все поля заполнены, проверьте заполненность почты и праолей", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
                        break;
                    case "user does not exist":
                        this.emailError = true
                        this.callError("Несуществующий пользователь", "Аккаунта с введённым Email не существует, проверьте корретность его заполнения", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
                        break;
                    case "password not correct":
                        this.passwordError = true
                        this.callError("Некорректный пароль", "Некорректный пароль от этого аккаунта", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}, {label: "Забыли пароль?", style: 'secondary', callback: () => {this.$router.push('/forgotPassword')}}])
                        break;
                    case "email not verified":
                        this.callError("Email не подтвержден", 'Мы отправили письмо с ссылкой для подтверждения на почту. Если письмо не пришло до сих пор, проверьте папку "Спам"', [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
                        break;
                    case "Incorrect Email":
                        this.emailError = true
                        this.callError("Некорректный Email", "Проверьте правильность введённого Email", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
                        break;
                    case "Empty password":
                        this.passwordError = true
                        this.callError("Пустой пароль", "Проверьте, ввели ли вы пароль", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
                        break;
                    case "Unexisting role":
                        this.callError("Некорректная роль", "Проверьте выбранную вами роль", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
                        break;
                    default:
                        this.callError("Обнаружена ошибка", error?.message + ". Повторите попытку входа позже", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
                }
            } finally {
                this.isLoading = false
            }
        },
        async checkForAuthorization() {
            try {
                let a = await this.loginViewModel.getAfterLoginURL()
                this.$router.push(a)
            } catch(e) {
                console.log(e)
            }
        },

        callError(title, text, buttons) {
            this.isAlertOpened = true
            this.errorToAlert.title = title
            this.errorToAlert.text = text
            this.errorToAlert.buttons = buttons
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
    },
    watch: {
        email: function() {
            this.emailError = false
        },
        password: function() {
            this.passwordError = false
        },
    },
    mounted() {
        this.checkForAuthorization()
    },
}
</script>

<style>
</style>