<template>
    <UILoadingWall v-if="!isLoaded" />
    <div v-else class="authorizationHolder">
        <div class="authorizationHolder__titleBlock">
            <div v-if="success" class="titleText">Успешная регистрация!</div>
            <div v-else class="titleText">Ошибка при регистрации</div>
        </div>
        <div class="messagePageBlock__textHolder">
            <div v-if="success" class="baseText">
                Ваш аккаунт успешно зарегистрирован. Вы можете войти, чтобы пользоваться платформой
                <div class="login__links messagePageBlock__buttons ">
                    <UIButton :style="'secondary'" @click="goTo('/login')">Войти</UIButton>
                </div>
            </div>
            <div v-else class="baseText">
                {{message}}
                <div class="login__links messagePageBlock__buttons ">
                    <UIButton :style="'secondary'" @click="goTo('/registration')">Регистрация</UIButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UIButton from "@/components/Buttons/UIButton.vue"
import UILoadingWall from "@/components/UILoadingWall.vue"
import {AuthorizationController} from "@/helpers/AuthorizationController.js"
import {ERROR_CODES} from "@/helpers/ErrorMaker.js"


export default {
    components: {
        UIButton, UILoadingWall,
    },
    data() {
        return {
            success: true,
            isLoaded: false,
            message: '',
            viewModel: new AuthorizationController(),
        }
    },
    methods: {
        async verify() {
            try {
                const key = this.fetchKeyFromURL()
                await this.viewModel.emailVerify(key)
            } catch(e) {
                this.success = false
                console.log(e.code)
                switch(e.code){
                    case ERROR_CODES.emailVerificationFake:
                        this.message = "Несуществующая или неподтвержденная ссылка, зарегистрируйтесь снова"
                        break;
                    case ERROR_CODES.emailVerificationExpired:
                        this.message = "Время на подтверждение почты истекло, зарегистрируйтесь снова";
                        break;
                    default:
                        this.message = "Проблемы в работе сервева, повторите попытку позже"
                        break;
                }
            } finally {
                this.isLoaded = true
            }
        },
        fetchKeyFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const product = urlParams.get('key')
            return product
        },
        goTo(path) {
            this.$router.push(path)
        }
    },
    mounted() {
        this.verify()
    }
}
</script>

<style>

</style>