<template>
    <UIModal v-if="isAddSocialModalOpened" v-model:isOpened="isAddSocialModalOpened">
        <div class="settingsPage__addSocialModal">
            <div class="settingsPage__title">Добавление канала связи</div>
            <UIInput v-model:value="newSocialTitle" :title="'Название канала'" :placeholder="'Социальная сеть/телефон'" class="settingsPage__addSocialModalInput"/>
            <UIInput v-model:value="newSocialValue" :title="'Контент'" :placeholder="'Ссылка/номер телефона'" class="settingsPage__addSocialModalInput"/>
            <UIButton class="settingsPage__addSocialModalButton" :style="'primary'" @click="addSocial">Добавить</UIButton>
        </div>
    </UIModal>

    <div class="headerPage">
        <!-- <UIHeader/> -->
        <div class="titleText pageTitle">Настройки профиля</div>
        <div class="backgroundCard settingsPage-maker">
            <div class="settingsPage__title">Основная информация</div>
            <div class="settingsPage__block">
                <div class="settingsPage__imageSide">
                    <div class="settingsPage__imageHolder">
                        <UIImageLoader :class="{skeleton: isLoading}" v-model:imageSrc="imageSrc"/>
                    </div>
                    <UIButton :style="'default'" class="settingsPage__imageButton" @click="clearAvatar" v-if="imageSrc">Очистить</UIButton>
                    <UIButton :style="'default'" class="settingsPage__imageButton" v-if="imageNew">Сохранить</UIButton>
                </div>
                <div class="settingsPage__infoSide">
                    <div class="settingsPage__nameHolder" :class="{skeleton: isLoading}">
                        <UIInput :title="'Название компании'" :placeholder="'Название'" v-model:value="name"/>
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

            <div class="settingsPage__title">Контакты</div>
            <div class="settingsPage__block">
                <div class="settingsPage__socials">
                    <div v-for="(s, index) in socialsList" :key="index" class="settingsPage__socialItem" :class="{hidden: !s.show}">
                        <span>{{s.title}}</span><span class="settingsPage__socialSplitter">: </span><span>{{s.value}}</span>
                        <div class="settingsPage__socialControls">
                            <UIButton @click="switchSocialHidden(index)" v-if="s.show" :style="'square colorless default'">H</UIButton>
                            <UIButton @click="switchSocialHidden(index)" v-if="!s.show" :style="'square colorless default'">h</UIButton>
                            <UIButton @click="deleteSocial(index)" :style="'square destructive'">X</UIButton>
                        </div>
                    </div>
                    <div class="settingsPage__socialCaption" v-if="socialsList.length == 0">Вы пока не добавили ни одного канала связи с вами</div>
                    <UIButton @click="isAddSocialModalOpened = true" class="settingsPage__socialButton" :style="'primary'">Добавить +</UIButton>
                </div>
                <!-- номер телефона
                соц сети
                адрес -->
            </div>

            <div class="settingsPage__title">Достижения</div>
            <div class="settingsPage__block">
                <div class="settingsPage__achivesCaption">
                    У вас пока нет достижений
                </div>
            </div>

            <div class="settingsPage__title">Адрес компании</div>
            <div class="settingsPage__block">
                
            </div>
        </div>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UIInput from '@/components/FormComponents/UIInput.vue';
import UIImageLoader from '@/components/FormComponents/ImageLoaders/UIImageLoader.vue'
import UIModal from '@/components/UIModal.vue';

import {UserDataController} from '@/helpers/UserDataController.js'


export default {
    components: {
        UIHeader, UIButton, UIInput, UIImageLoader, UIModal,
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
            isAddSocialModalOpened: false,
            newSocialTitle: "",
            newSocialValue: "",
            socialsList: [
                {title: 'Номер телефона', value: '89105834008', show: true},
                {title: 'Номер телефона', value: '89105834008', show: true},
                {title: 'Номер телефона', value: '89105834008', show: true},
                {title: 'Номер телефона', value: '89105834008', show: true},
            ],
            achivesList: [],
        }
    },
    methods: {
        clearAvatar() {
            this.imageSrc = undefined
        },
        addSocial() {
            this.socialsList.push({
                title: this.newSocialTitle,
                value: this.newSocialValue,
                show: true,
            })
            this.isAddSocialModalOpened = false
        },
        deleteSocial(index) {
            //
            console.log(index, this.socialsList.slice(index))
        },
        switchSocialHidden(index) {
            this.socialsList[index].show = !this.socialsList[index].show
        },
    }
}
</script>

<style>

</style>