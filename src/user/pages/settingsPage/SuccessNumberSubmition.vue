<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="authorizationHolder">
            <div class="authorizationHolder__titleBlock">
                <div class="titleText">Номер подтвержден!</div>
            </div>
            <div class="messagePageBlock__textHolder">
                <div class="baseText">
                    Ваш номер успешно подтвержден. Вам доступен расширенный функционал платформы. Вы можете создавать проекты и работать с исполнителями.
                    <div class="login__links messagePageBlock__buttons ">
                        <UIButton :style="'secondary'" @click="goBack()">Профиль</UIButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue'
import UIButton from '@/components/Buttons/UIButton.vue';
import { UserDataController } from '@/helpers/UserDataController';

export default {
    components: {
        UIHeader, UIButton,
    },
    methods: {
        async goBack() {
            let role = (await UserDataController.shared.getData()).role
            if (role == 'contractor') {
                this.$router.push('/maker/settingsPage')
            } else if (role == 'customer') {
                this.$router.push('/user/settingsPage')
            }
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style>

</style>