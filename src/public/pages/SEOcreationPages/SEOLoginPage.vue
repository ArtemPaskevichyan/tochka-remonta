<template>
  <div class="login authorizationHolder">
        
        <div class="authorizationHolder__content">
            <div class="authorizationHolder__titleBlock login__title">
                <div class="titleText">Вход в аккаунт SEO</div>
            </div>
            <div class="login__formBlock">
                <UIInput :title="'Логин'"
                v-model:value="email" :style="'small'" :role="'email'"></UIInput>
                <UIInput class="lastInput" :title="'Пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'"
                v-model:value="password" :role="'password'" :style="'small'"></UIInput>
            </div>

            <div class="login__buttonBlock">
                <UIButton @click="sendLogin" class="login__mainButton" :style="buttonStyle">Войти</UIButton>
            </div>
        </div>
    </div>
    <UILoadingWall v-if="isLoading"/>
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
import UIInput from '@/components/FormComponents/UIInput.vue';
import UIButton from '@/components/Buttons/UIButton.vue'
import UILoadingWall from '@/components/UILoadingWall.vue';
import UIAlert from '@/components/UIAlert.vue';
import UICheckbox from '@/components/FormComponents/UICheckbox.vue'

import {AuthorizationController} from "@/helpers/AuthorizationController.js"

export default {
  components: {
    UIInput, UIButton, UILoadingWall, UIAlert, UICheckbox,
  },
  data() {
    return {
      email: "",
      password: "",
      errorToAlert: {
        buttons: [],
        title: "",
        text: "",
      },
      isLoading: false,
      isAlertOpened: false,
      loginViewModel: new AuthorizationController(),
    }
  },
  methods: {
    async sendLogin() {
      try {
        this.isLoading = true
        await this.loginViewModel.sendSEOLogin(this.email?.trim(), this.password)
        this.$router.push("/seo/createArticle")
      } catch(error) {
        switch(error?.message) {
          case "email or password is empty":
              this.callError("Не заполненные поля", "Не все поля заполнены, проверьте заполненность почты и праолей", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
              break;
          case "user does not exist":
              this.callError("Несуществующий пользователь", "Аккаунта с введённым Email не существует, проверьте корретность его заполнения", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
              break;
          case "password not correct":
              this.callError("Некорректный пароль", "Некорректный пароль от этого аккаунта", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}, {label: "Забыли пароль?", style: 'secondary', callback: () => {this.$router.push('/forgotPassword')}}])
              break;
          case "email not verified":
              this.callError("Email не подтвержден", 'Мы отправили письмо с ссылкой для подтверждения на почту. Если письмо не пришло до сих пор, проверьте папку "Спам"', [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
              break;
          case "Incorrect Email":
              this.callError("Некорректный Email", "Проверьте правильность введённого Email", [{label: "OK", style: 'secondary', callback: () => {this.isAlertOpened = false}}])
              break;
          case "Empty password":
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
    callError(title, text, buttons) {
      this.isAlertOpened = true
      this.errorToAlert.title = title
      this.errorToAlert.text = text
      this.errorToAlert.buttons = buttons
    },
  },
  computed: {
    buttonStyle: function() {
      return (this.email == '' || this.password == '') ? 'disabled' : 'primary'
    },
  },
}
</script>