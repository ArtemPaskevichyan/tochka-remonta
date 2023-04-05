<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="titleText pageTitle">Настройки профиля</div>
        <div class="backgroundCard settingsPage">
            <div class="settingsPage__imageSide">
                <div class="settingsPage__imageHolder">
                    <UIImageLoader :class="{skeleton: isLoading}" v-model:imageSrc="imageSrc"/>
                </div>
                <UIButton :style="'default'" class="settingsPage__imageButton" @click="clearAvatar" v-if="imageSrc">Очистить</UIButton>
                <UIButton :style="'default'" class="settingsPage__imageButton" @click="setAvatar" v-if="imageNew">Сохранить</UIButton>
            </div>
            <div class="settingsPage__infoSide">
                <div class="settingsPage__nameHolder" :class="{skeleton: isLoading}">
                    <UIInput :title="'Ваше имя'" :placeholder="'Имя'" v-model:value="name"/>
                    <UIButton :style="buttonStyle">Сохранить</UIButton>
                </div>
                <div class="settingsPage__stats baseText">
                    UUID пользователя: <span class="baseText__value" :class="{skeleton: isLoading}">{{uuid}}</span><br/>
                    Email: <span class="baseText__value" :class="{skeleton: isLoading}">{{email}}</span><br/>
                    Роль: <span class="baseText__value" :class="{skeleton: isLoading}">{{role}}</span><br/>
                    На платформе: <span class="baseText__value" :class="{skeleton: isLoading}">{{time}}</span><br/>
                    Количество проектов (за все время): <span class="baseText__value" :class="{skeleton: isLoading}">{{projectsCount}}</span><br/>
                </div>
                <div class="settingsPage__numberBlock" :class="{needsToApprove: !isNumberApproved}">
                    Номер телефона: <span class="settingsPage__number" :class="{skeleton: isLoading}" v-if="isNumberApproved">{{number}}</span>
                                    <span class="settingsPage__number" :class="{skeleton: isLoading}" v-else>Требуется подтверждение</span>
                    <UIButton :style="'default'" v-if="number && isNumberApproved" @click="$router.push('/user/submitPhonePage')">Изменить</UIButton>
                    <UIButton :style="'default'" v-else @click="$router.push('/user/submitPhonePage')">Подтвердить</UIButton>
                </div>
            </div>
        </div>
        <UIButton :style="'destructive'" @click="exit()">Выйти</UIButton>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UIInput from '@/components/FormComponents/UIInput.vue';
import UIImageLoader from '@/components/FormComponents/ImageLoaders/UIImageLoader.vue'

import {SettingsPageController} from '@/user/pages/settingsPage/helpers/settingsPageController.js'
import {UserDataController} from '@/helpers/UserDataController.js'

export default {
    components: {
        UIHeader, UIButton, UIInput, UIImageLoader
    },
    data() {
        return {
            imageNew: false,
            imageSrc: undefined,
            name: "n",
            uuid: "n",
            role: "n",
            time: "n",
            projectsCount: 0,
            isNumberApproved: false,
            number: "n",
            email: "n",
            isLoading: false,
            buttonStyle: 'disabled',
            viewModel: new SettingsPageController(),
        }
    },
    methods: {
        exit() {
            UserDataController.shared.exit()
        },
        async fetchData() {
            this.isLoading = true
            var data = await UserDataController.shared.getData()

            this.name = data?.name
            this.uuid = data?.uuid
            this.role = data?.role == "customer" ? "Заказчик" : "Исполнитель"
            this.projectsCount = data?.projectsCount
            this.email = data?.email
            this.isNumberApproved = Boolean(data?.phone)
            this.number = data?.phone

            const oneDay = 24 * 60 * 60 * 1000
            this.time = Math.max(Math.round((new Date(Date.now() - Date.parse(data?.registration_date))) / oneDay), 1)

            this.isLoading = false
        },
        clearAvatar() {
            try {
                this.imageSrc = undefined
                this.viewModel.clearAvatar()
            } catch(e) {
                //
            }
        },
        setAvatar() {
            try {
                this.viewModel.setAvatar(this.imageSrc)
            } catch(e) {
                //
            }
        }
    },
    watch: {
        name: function() {
            if (this.name || this.name?.length > 0) {
                this.buttonStyle = 'default'
            } else {
                this.buttonStyle = 'disabled'
            }
            
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>

<style>

</style>