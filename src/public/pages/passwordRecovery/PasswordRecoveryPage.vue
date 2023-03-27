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
</template>

<script>

import { AuthorizationController } from "@/helpers/AuthorizationController.js"
import UIInput from "@/components/FormComponents/UIInput.vue";
import UIButton from '@/components/Buttons/UIButton.vue';


export default {
    components: {
        UIInput, UIButton,
    },
    data() {
        return {
            password1: '',
            password2: '',
        }
    },
    methods: {

    },
    computed: {
        buttonStyle: function() {
            return (this.password1 != '' && this.password2 != '') ? 'primary' : 'disabled'
        }
    }
}
</script>