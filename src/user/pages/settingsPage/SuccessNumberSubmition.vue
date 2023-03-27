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
                        <UIButton :style="'secondary'" @click="$router.push('/user/settingsPage')">Профиль</UIButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue'
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIHeader, UIButton,
    },
    data() {
        return {

        }
    }
}
</script>

<style>

</style>