<template>
    <div class="authorizationHolder">
        <div class="authorizationHolder__titleBlock">
            <div class="titleText">Восстановление пароля</div>
        </div>

        <div class="authorizationHolder__centerAligned">
            <div class="authorizationHolder__content registration__formBlock">
                <UIInput :title="'Новый пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" 
                v-model:value="password1" :role="'password'" :style="'small'"></UIInput>
                <UIInput :title="'Повторите пароль'" :placeholder="'⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁'" 
                v-model:value="password2" :role="'password'" :style="'small'"></UIInput>

                <UIButton :style="buttonStyle" class="login__mainButton recovery__button" @click="() => {}">Подтвердить</UIButton>
            </div>
        </div> 
    </div>

    <UILoadingWall v-if="isLoading"/>
</template>

<script>

import { AuthorizationController } from "@/helpers/AuthorizationController.js"
import UIInput from "@/components/FormComponents/UIInput.vue";
import UIButton from '@/components/Buttons/UIButton.vue';
import UILoadingWall from "@/components/UILoadingWall.vue";


export default {
    components: {
        UIInput, UIButton, UILoadingWall,
    },
    data() {
        return {
            viewController: new AuthorizationController(),
            password1: '',
            password2: '',
            isLoading: false,
        }
    },
    methods: {
        async sendRecovery() {
            try {
                this.isLoading = true
                const key = this.fetchKeyFromURL()
                await viewController.sendRecovery(key, password1, password2) //
                
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
        },

        fetchKeyFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const product = urlParams.get('key')
            return product
        },
    },
    computed: {
        buttonStyle: function() {
            return (this.password1 != '' && this.password2 != '') ? 'primary' : 'disabled'
        },
    }
}
</script>