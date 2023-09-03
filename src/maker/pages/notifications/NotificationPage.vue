<template>
    <div class="headerPage notificationPage tabBarPage">
        <UIHeader/>
        <UITabBar :page="'Уведомления'"/>
        <div>
            <div class="titleText pageTitle">Новые уведомления</div>
            <div class="notificationPage" v-if="newNotifications?.length > 0">
                <UINotification :isLoading="isLoading" :key="index" v-for="(n, index) in newNotifications" :model="n" @action="handleAction" :ref="(el) => {addObservers(el, n.id)}"/>
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
import UITabBar from '@/components/UITabBar.vue';
import UINotification from '@/components/UINotification.vue';
import { NotificationController } from './helpers/notificationController';

export default {
    components: {
        UIHeader, UINotification, UITabBar,
    },
    data() {
        return {
            isLoading: true,
            notifications: [{}, {}, {}],
            notificationController: new NotificationController(this.$router),
            oldNotifications: [{}, {}, {}],
            newNotifications: [{}, {}, {}],
            observersAdded: false,
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
                
                for (let i = 0; i < notifications?.length; i++) {
                    let notification = notifications[i]
                    if (notification.viewed === undefined) {
                        console.log("udefined viewed")
                    } else if (notification.viewed) {
                        this.oldNotifications.push(notification)
                    } else {
                        this.newNotifications.push(notification)
                    }
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
        async viewNotification(id) {
            this.notificationController.viewNotification(id)
        },

        addObservers(data, id) {
            if (this.isLoading || !data) { return }

            var intersectionOptions = {
                    rootMargin: '0px',
                    threshold: 1.0,
                }
            
            let observer = new IntersectionObserver(() => {
                console.log("RE")
                this.notificationController.viewNotification(id)
            }, intersectionOptions)
            observer.observe(data?.$el)
        }
    },
    mounted() {
        this.getNotifications()
    },
}
</script>