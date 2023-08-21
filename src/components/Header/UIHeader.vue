<template>
    <div v-if="isNavigationOpened" class="header__dropdownMenu" @click.stop>
        <div class="header__dropdownTitleBlock" @click="goTo('/settingsPage')">
            <div class="header__dropdownTitle" :class="{skeleton: !isDataLoaded}">
                {{ email }}
            </div>
            <div class="header__dropdownRole" :class="{skeleton: !isDataLoaded}">
                {{ role }}
            </div>
        </div>
        <button class="header__dropdownMenuItem" @click="goTo('/myProjects')">
            <i class="icon-cards header__icon"></i> Мои проекты<span v-if="countOfProjects > 0" style="margin-left: 0.3em;">({{countOfProjects}})</span>
        </button>
        <button class="header__dropdownMenuItem" @click="goTo('/search')">
            <i class="icon-search header__icon"></i> {{searchText}}
        </button>
        <button class="header__dropdownMenuItem" @click="goTo('/test', true)">
            <i class="icon-chat header__icon"></i> Чат
        </button>
        <button class="header__dropdownMenuItem" @click="goTo('/outcomingSuggestions')">
            <i class="icon-person-up header__icon"></i> Мои заявки
        </button>
        <button class="header__dropdownMenuItem" @click="goTo('/notifications')">
            <i class="icon-bell header__icon"></i> Уведомления <UINotificationCounter class="header__dropdownNotificationCounter" :count="notificationCount" v-if="notificationCount > 0"></UINotificationCounter>
        </button>
        <button class="header__dropdownMenuItem" @click="goTo('/suggestions')" v-if="role == 'Исполнитель'">
            <i class="icon-person-plus header__icon"></i>Предложенные мне
        </button>
        <button class="header__dropdownMenuItem" @click="goToSettings">
            <i class="icon-gear header__icon"></i> Настройки профиля
        </button>
        <button class="header__dropdownMenuItem primary" @click="goTo('/createProject')">
            <i class="icon-plus header__icon"></i> {{createText}}
        </button>
        <div class="header__dropdownMenuItem hight">
            <UIProgressBar class="header__progressView" :title="'Заполненность профиля'" :value="profileFillProgress"/>
        </div>
    </div>

    <div class="header">
        <span class="header__logoBlock">
            <div class="header__logo">
                <img class="desktopOnly" src="@/assets/images/logo.png" alt="logo" width="96" height="32" @click="$router.push({name: role == 'Исполнитель' ? 'makerSearch' : 'userSearch'})">
                <img class="mobileOnly" src="@/assets/images/shortLogo.png" alt="logo" width="30" height="32" @click="$router.push({name: role == 'Исполнитель' ? 'makerSearch' : 'userSearch'})">
            </div>
            <div class="header__location" :class="{skeleton: !isDataLoaded}" @click="openCitySelector">
                {{ city ?? "Не определено" }}
            </div>
        </span>
        <div class="header__locationQuestion" ref="cityQuestion" v-if="showCityQuestion">
            Ваш город <span class="header__locationCity">{{ city }}</span>?
            <div class="header__locationControls">
                <UIButton :style="'secondary'" @click="denyCityQuestion">Выбрать другой</UIButton>
                <UIButton :style="'primary'" @click="submitCityQuestion">Да</UIButton>
            </div>
        </div>

        <div @click.stop="showHideNavigation" class="header__profileBlock">
            <UINotificationIndicatorHolder :amount="notificationCount" :displayZero="false">
                <span class="header__profileLabel" :class="{skeleton: !isDataLoaded}">
                    Меню
                </span>
            </UINotificationIndicatorHolder>
            <div class="header__profileAvatar">
                <img :src="avatarSrc" alt="avatar">
            </div>
        </div>
    </div>

    <UIModal v-if="isCitySelectorOpened" v-model:isOpened="isCitySelectorOpened">
        <CitySelect @selected="updateCity"/>
    </UIModal>
</template>

<script>
import UINotificationIndicatorHolder from "../NotificationIndicator/UINotificationIndicatiorHolder.vue"
import UIProfileProgress from './UIProfileProgress.vue'
import UINotificationCounter from "../NotificationIndicator/UINotificationCounter.vue"
import UIProgressBar from "../UIProgressBar.vue"

import { UserDataController } from "@/helpers/UserDataController.js"
import { serverURL } from "@/preferenses"
import { CityController } from "./CityController.js"
import defaultAvatar from "@/assets/images/profileIcon.png"
import UIModal from '@/components/UIModal.vue'
import CitySelect from '@/components/Supports/CitySelect.vue'
import UIButton from "@/components/Buttons/UIButton.vue";

export default {
    components: {
        UINotificationIndicatorHolder, UIProfileProgress, UINotificationCounter,
        UIProgressBar, UIModal, CitySelect, UIButton,
    },
    data() {
        return {
            isNavigationOpened: false,
            email: "mayemail@mail.ru",
            role: "Не определена",
            countOfProjects: 0,
            countOfNotifications: 0,
            isDataLoaded: false,
            notificationCount: 0,
            profileFillProgress: 0,
            avatarSrc: undefined,
            baseAvatarSrc: serverURL + "/api/v1/auth/get_avatar?filename=",
            clickOutsideListener: undefined,
            searchText: "Поиск",
            createText: "Добавить",
            city: "Не определено",
            isCitySelectorOpened: false,
            showCityQuestion: false,
            timer: undefined,
            cityController: new CityController(),
        }
    },
    methods: {
        showHideNavigation() {
            this.isNavigationOpened = !this.isNavigationOpened
            if (this.isNavigationOpened) {
                document.addEventListener("click", this.showHideNavigation)
            } else {
                document.removeEventListener("click", this.showHideNavigation)
            }
        },

        async fetchData() {
            this.isDataLoaded = false

            let data = await UserDataController.shared.getData()

            this.email = data.email
            if (data.role == "customer") {
                this.role = "Заказчик"
            } else if (data.role == "contractor") {
                this.role = "Исполнитель"
            }
            this.avatarSrc = data.avatar?.length > 0 ? this.baseAvatarSrc + data.avatar : defaultAvatar
            this.isDataLoaded = true
            this.countOfProjects = data.projectsCount
            this.profileFillProgress = data.profileFullness
            UserDataController.shared.getNotificationsCount()
                .then((response) => {
                    this.notificationCount = response
                })
                .catch((error) => {
                    console.log("ERROR WITH NOTIFICATIONS", error)
                })
            this.city = data.city
            
            this.setupItems()
            this.beforeShowCityQuestion()
        },

        goTo(path, ignoreRole=false) {
            var p = path
            if (ignoreRole) { this.$router.push(p); return }

            if (this.role == "Заказчик") {
                p = "/user" + p
            } else if (this.role == "Исполнитель") {
                p = "/maker" + p
            }
            this.$router.push(p);
        },

        goToSettings() {
            console.log("GO TO SETTINGS")
            if (this.role == "Исполнитель") this.$router.push({name: "makerSettingsPage"})
            else this.$router.push({name: "userSettingsPage"})
        },
        
        setupItems() {
            if (this.role == "Исполнитель") {
                this.searchText = "Поиск проектов"
                this.createText = "Добавить проект"
            } else if (this.role == "Заказчик") {
                this.searchText = "Поиск исполнителей"
                this.createText = "Создать проект"
            }
        },

        updateCity(city) {
            this.isCitySelectorOpened = false
            this.city = city
            this.cityController.saveCityToStorage(this.city)
            UserDataController.shared.setUserCity(city)
        },

        openCitySelector() {
            this.isCitySelectorOpened = true
        },

        beforeShowCityQuestion() {
            if (!this.cityController.needToShowCityQuestion(this.city)) return
            this.showHideCityQuestion()

            this.timer = setTimeout(() => {
                // console.log(this)
                this.$refs.cityQuestion.classList.add("hidding")
                setTimeout(() => {
                    this.submitCityQuestion()
                }, 300)
            }, 4000)
        },

        showHideCityQuestion() {
            this.showCityQuestion = !this.showCityQuestion
        },

        submitCityQuestion() {
            this.showHideCityQuestion()
            clearTimeout(this.timer)
            this.cityController.saveCityToStorage(this.city)
        },

        denyCityQuestion() {
            this.showHideCityQuestion()
            clearTimeout(this.timer)
            this.showCityQuestion = false
            this.isCitySelectorOpened = true
        },
    },
    mounted() {
        this.fetchData()
    },
    unmounted() {
        try {
            document.removeEventListener("click", this.showHideNavigation)
        } catch(e) {}
    },
}
</script>

<style>
</style>



