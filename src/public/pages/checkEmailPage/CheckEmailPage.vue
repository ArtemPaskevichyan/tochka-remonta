<template>
    <div class="authorizationHolder">
        <div class="authorizationHolder__titleBlock">
            <div class="titleText">Подтвердите регистрацию</div>
        </div>

        <div class="messagePageBlock__textHolder">
            <div class="baseText">Мы отправили письмо для подтверждения регистрации вам на почту {{ email }}.<br>
                Если письмо не приходит на протяжении долгого времени, проверите папку "Спам"
                <div class="login__links messagePageBlock__buttons ">
                    <UILink :link="'/registration'" :size="'small'">Другая почта</UILink>

                    <div v-if="time != '00:00'" class="smallText caption" :style="'disabled'">Отправить повторно через {{ time }}</div>
                    <UIButton v-else :style="'secondary'" @click="sendEmailAgain">Отправить повторно</UIButton>
                </div>
            </div>
        </div> 
    </div>
    <UILoadingWall v-if="isLoading"></UILoadingWall>
</template>

<script>
    import {AuthorizationController} from "@/helpers/AuthorizationController.js"
    import {Timer} from "@/helpers/Timer.js"
    import UILink from "@/components/FormComponents/UILink.vue"
    import UIButton from "@/components/Buttons/UIButton.vue"
    import UILoadingWall from "@/components/UILoadingWall.vue"

    export default {
        components: {
            UILink,
            UIButton,
            UILoadingWall,
        },
        data() {
            return {
                time: "00:00",
                viewModel: new AuthorizationController(),
                isLoading: false,
            }
        },
        props: ["email"],
        methods: {
            updateTime() {
                var time = Timer.shared.timeLeft
                this.time = String(time.minutes).padStart(2, "0") + ":" 
                + String(time.seconds).padStart(2, "0")
            },
            async sendEmailAgain() {
                try {
                    this.isLoading = true
                    await this.viewModel.sendEmailAgain(this.email?.trim())
                    
                    Timer.shared.setTimer(120)
                } catch(e) {
                    console.log("E", e)
                } finally {
                    this.isLoading = false
                }
            }
        },
        created() {
            setInterval(this.updateTime, 200)
        },
    }
</script>

<style>

</style>