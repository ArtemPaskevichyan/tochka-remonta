<template>
    <div class="headerPage">
        <UIHeader/>
        <div>
            <div class="titleText pageTitle">Новые уведомления</div>
            <div class="notificationPage" v-if="newNotifications?.length > 0">
                <UINotification :isLoading="isLoading" :key="index" v-for="(n, index) in newNotifications"/>
            </div>
            <div class="notificationPage__caption" v-else>
                Новых уведомлений нет
            </div>
        </div>
        <div>
            <div class="titleText pageTitle">Прочитанные</div>
            <div class="notificationPage" v-if="oldNotifications?.length > 0">
                <UINotification :isLoading="isLoading" :key="index" v-for="(n, index) in oldNotifications"/>
            </div>
            <div class="notificationPage__caption" v-else>
                У вас ещё нет непрочитанных уведомлений
            </div>
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
            oldNotifications: [{}, {}, {}],
            newNotifications: [{}, {}, {}],
        }
    },
    methods: {
        async getNotifications() {
            try {
                this.isLoading = true
                var notifications = this.notificationController.getNotifications()
                this.oldNotifications = []
                this.newNotifications = []
                
                for (let noticitaion of notifications) {
                    this.oldNotifications.push(noticitaion)
                    this.newNotifications.push(noticitaion)
                }

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