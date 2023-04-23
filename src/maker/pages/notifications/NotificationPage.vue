<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="titleText pageTitle">Новые уведомления</div>
        <div class="notificationPage">
            <UINotification :isLoading="isLoading" :key="index" v-for="(n, index) in notifications"/>
        </div>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue';
import UINotification from '@/components/UINotification.vue';

export default {
    components: {
        UIHeader, UINotification,
    },
    data() {
        return {
            isLoading: true,
            notifications: [{}, {}, {}],
        }
    }
}
</script>