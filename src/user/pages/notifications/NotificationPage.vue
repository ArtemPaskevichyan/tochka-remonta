<template>
    <div class="headerPage">
        <UIHeader/>
        <div>
            <div class="titleText pageTitle">Новые уведомления</div>
            <div class="notificationPage" v-if="newNotifications?.length > 0">
                <UINotification :isLoading="isLoading" :key="index" v-for="(n, index) in newNotifications" :model="n" @action="handleAction"/>
            </div>
            <div class="notificationPage__caption" v-else>
                Новых уведомлений нет
            </div>
        </div>
        <div>
            <div class="titleText pageTitle">Прочитанные</div>
            <div class="notificationPage" v-if="oldNotifications?.length > 0">
                <UINotification :isLoading="isLoading" :key="index" v-for="(n, index) in oldNotifications" :model="n" @action="handleAction"/>
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
import { NotificationController } from './helpers/notificationController';

export default {
    components: {
        UIHeader, UINotification,
    },
    data() {
        return {
            isLoading: true,
            notifications: [{}, {}, {}],
            notificationController: new NotificationController(this.$router),
            oldNotifications: [{}, {}, {}],
            newNotifications: [{}, {}, {}],
        }
    },
    methods: {
        async getNotifications() {
            try {
                this.isLoading = true
                var notifications = await this.notificationController.getNotifications()
                this.oldNotifications = []
                this.newNotifications = []
                
                console.log(notifications)
                
                for (let noticitaion of notifications) {
                    this.oldNotifications.push(noticitaion)
                    this.newNotifications.push(noticitaion)
                }

            } catch(e) {
                console.log("ERROR", e)
            } finally {
                this.isLoading = false
            }
        },
        handleAction(model) {
            if (!model?.target) { return }
            
            switch(model.target) {
                case "fill_user":
                    this.notificationController.fillUser(model?.targetData)
                    break;
                case "status_changed":
                    this.notificationController.statusChanged(model?.targetData)
                    break;
                case "response":
                    this.notificationController.newResponse(model?.targetData)
                    break;
                case "negotiation":
                    this.notificationController.newNegotiation(model?.targetData)
                    break;
            }
        },
    },
    mounted() {
        this.getNotifications()
    }
}
</script>