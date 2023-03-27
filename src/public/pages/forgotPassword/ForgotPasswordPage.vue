<template>
    <div class="authorizationHolder">
        <div class="authorizationHolder__titleBlock">
            <div class="titleText">Восстановление пароля</div>
        </div>

        <div class="authorizationHolder__centerAligned">
            <div class="authorizationHolder__content">
                <UIInput :title="'Email'" :placeholder="'myemail@mail.ru'"
                v-model:value="email" :style="'small'"></UIInput>
                <div class="caption smallText forgotPassword__text">
                    Введите email, указаный при регистрации, мы пришлем на него инструкцию по восстановлению пароля.
                </div>
                <UIButton :style="buttonStyle" class="login__mainButton" @click="sendPasswordRecovery">Отправить письмо</UIButton>
            </div>
        </div> 
    </div>
    <UILoadingWall v-if="isLoading"></UILoadingWall>
</template>

<script>
import {AuthorizationController} from "@/helpers/AuthorizationController.js"
import UIInput from "@/components/FormComponents/UIInput.vue";
import UIButton from "@/components/Buttons/UIButton.vue";
import UILoadingWall from "@/components/UILoadingWall.vue";

export default {
    components: {
        UIInput, UIButton, UILoadingWall,
    },
    data() {
        return {
            email: "",
            viewModel: new AuthorizationController(),
            isLoading: false,
        }
    },
    methods: {
        async sendPasswordRecovery() {
            try {
                this.isLoading = true
                await this.viewModel.sendPasswordRecovery(this.email)
            } catch(error) {
                alert(error)
            } finally {
                this.isLoading = false
            }
        }
    },
    computed: {
        buttonStyle: function() {
            return this.email == '' ? 'disabled' : 'primary'
        }
    }
}
</script>

<style>
</style>