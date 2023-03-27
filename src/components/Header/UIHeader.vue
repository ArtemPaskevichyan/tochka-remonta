<template>
    <div v-if="isNavigationOpened" class="header__dropdownMenu">
        <div class="header__dropdownTitleBlock">
            <div class="header__dropdownTitle" :class="{skeleton: !isDataLoaded}">
                {{ email }}
            </div>
            <div class="header__dropdownRole" :class="{skeleton: !isDataLoaded}">
                {{ role }}
            </div>
        </div>
        <button class="header__dropdownMenuItem" @click="goTo('/user/myProjects')">
            Мои проекты<span v-if="countOfProjects > 0" style="margin-left: 0.3em;">({{countOfProjects}})</span>
        </button>
        <button class="header__dropdownMenuItem" @click="goTo('/user/search')">
            Поиск исполнителей
        </button>
        <button class="header__dropdownMenuItem">
            Уведомления <UINotificationCounter class="header__dropdownNotificationCounter" :count="countOfNotifications" v-if="countOfNotifications > 0"></UINotificationCounter>
        </button>
        <button class="header__dropdownMenuItem" @click="goTo('/user/settingsPage')">
            Настройки профиля
        </button>
        <button class="header__dropdownMenuItem primary" @click="goTo('/user/createProject')">
            Создать проект +
        </button>
        <div class="header__dropdownMenuItem hight">
            <UIProgressBar class="header__progressView" :title="'Заполненность профиля'" :value="profileFillProgress"/>
        </div>
    </div>

    <div class="header">
        <div @click="see" class="header__location" :class="{skeleton: !isDataLoaded}">
            МОСКВА
        </div>
        <div @click="showHideNavigation" class="header__profileBlock">
            <UINotificationIndicatorHolder :amount="notificationCount" :displayZero="false">
                <span class="header__profileLabel" :class="{skeleton: !isDataLoaded}">
                    Профиль
                </span>
            </UINotificationIndicatorHolder>
            <UIProfileProgress></UIProfileProgress>
        </div>
    </div>
</template>

<script>
import UINotificationIndicatorHolder from "../NotificationIndicator/UINotificationIndicatiorHolder.vue"
import UIProfileProgress from './UIProfileProgress.vue'
import UINotificationCounter from "../NotificationIndicator/UINotificationCounter.vue"
import UIProgressBar from "../UIProgressBar.vue"
import {UserDataController} from "../../helpers/UserDataController.js"

export default {
    components: {
        UINotificationIndicatorHolder, UIProfileProgress, UINotificationCounter,
        UIProgressBar,
    },
    data() {
        return {
            isNavigationOpened: false,
            email: "mayemail@mail.ru",
            role: "Заказчик",
            countOfProjects: 0,
            countOfNotifications: 0,
            isDataLoaded: false,
            notificationCount: 0,
            profileFillProgress: 0,
        }
    },
    methods: {
        showHideNavigation() {
            this.isNavigationOpened = !this.isNavigationOpened
        },
        async see() {
            
        },
        async fetchData() {
            this.isDataLoaded = false
            var data = await UserDataController.shared.getData()

            this.email = data.email
            if (data.role == "customer") {
                this.role = "Заказчик"
            } else if (this.role == "contractor") {
                this.role = "Исполнитель"
            }
            this.isDataLoaded = true
            this.countOfProjects = data.projectsCount
            this.profileFillProgress = data.profileFullness
        },
        goTo(path) {
            this.$router.push(path)
        }
    },
    mounted() {
        console.log("HEADER IS MOUNTED")
        this.fetchData()
    }
}
</script>

<style>
</style>



