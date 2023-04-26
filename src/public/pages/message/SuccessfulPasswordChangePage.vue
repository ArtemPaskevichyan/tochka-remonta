<template>
    <div class="authorizationHolder messagePageBlock">
        <div class="registration__titleBlock">
            <div class="titleText">Пароль обновлен</div>
        </div>

        <div class="messagePageBlock__textHolder">
            <div class="baseText">Ваш пароль успешно обновлен! Войдите в свой аккаунт с новым паролем.
                <div class="login__links messagePageBlock__buttons ">
                    <UIButton :style="'primary'" @click="goTo('/login')">Войти</UIButton>
                </div>
            </div>
        </div> 
    </div>
</template>

<script>
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIButton, 
    },
    
    data() {
        return {

        }
    },

    methods: {
        goTo(path) {
            this.$router.push(path)
        }
    },
}
</script>

<style>

</style>