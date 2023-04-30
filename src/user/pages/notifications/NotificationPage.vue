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
import { NotificationController } from './helpers/notificatioController';

export default {
    components: {
        UIHeader, UINotification,
    },
    data() {
        return {
            isLoading: true,
            notifications: [{}, {}, {}],
            notificationController: new NotificationController(),
        }
    },
    methods: {
        async getNotifications() {
            try {
                this.isLoading = true
                this.notifications = this.notificationController.getNotifications()
            } catch(e) {
                console.log("ERROR", e)
            } finally {
                this.isLoading = false
            }
        }
    },
    mounted() {
        this.getNotifications()
    }
}
</script>