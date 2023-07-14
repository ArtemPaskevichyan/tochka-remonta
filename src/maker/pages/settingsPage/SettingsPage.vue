<template>
       <UIModal v-if="isAddSocialModalOpened" v-model:isOpened="isAddSocialModalOpened">
        <div class="settingsPage__addSocialModal">
            <div class="settingsPage__title">Добавление канала связи</div>
            <UIInput v-model:value="newSocialTitle" :title="'Название канала'" :placeholder="'Социальная сеть/телефон'" class="settingsPage__addSocialModalInput"/>
            <UIInput v-model:value="newSocialValue" :title="'Контент'" :placeholder="'Ссылка/номер телефона'" class="settingsPage__addSocialModalInput"/>
            <UIButton class="settingsPage__addSocialModalButton" :style="'primary'" @click="addSocial">Добавить</UIButton>
        </div>
    </UIModal>

    <UILoadingWall v-if="totalLoading"/>

    <div class="headerPage">
        <UIHeader/>
        <div class="titleText pageTitle">Настройки профиля</div>
        <div class="backgroundCard settingsPage-maker">
            <div class="settingsPage__title">Основная информация</div>
            <div class="settingsPage__block">
                <div class="settingsPage__imageSide">
                    <div class="settingsPage__imageHolder">
                        <UIImageLoader :class="{skeleton: isLoading}" v-model:imageSrc="imageSrc" @fileLoaded="setAvatar"/>
                    </div>
                    <UIRating :rating="rating"/>
                </div>
                <div class="settingsPage__infoSide">
                    <div class="settingsPage__nameHolder" :class="{skeleton: isLoading}">
                        <UIInput :title="'Название компании'" :placeholder="'Название'" v-model:value="name"/>
                        <UIButton :style="buttonStyle" @click="setName">Сохранить</UIButton>
                    </div>
                    <div class="settingsPage__stats baseText">
                        UUID пользователя: <span class="baseText__value" :class="{skeleton: isLoading}">{{uuid}}</span><br/>
                        Email: <span class="baseText__value" :class="{skeleton: isLoading}">{{email}}</span><br/>
                        Роль: <span class="baseText__value" :class="{skeleton: isLoading}">{{role}}</span><br/>
                        На платформе: <span class="baseText__value" :class="{skeleton: isLoading}">{{time}}</span> {{daysAdding}}<br/>
                        Количество проектов: <span class="baseText__value" :class="{skeleton: isLoading}">{{projectsCount}}</span><br/>
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
                    <div v-for="(s, index) in socialsList" :key="index" class="settingsPage__socialItem" :class="{hidden: !s.show, skeleton: isSocialsLoading}">
                        <div class="settingsPage__socialInfo">
                            <span>{{s.title}}</span><span class="settingsPage__socialSplitter">: </span><span>{{s.value}}</span>
                        </div>   
                        <div class="settingsPage__socialControls">
                            <UIButton @click="deleteSocial(index)" :style="'square destructive'"><i class="icon-cross inline-icon"></i></UIButton>
                        </div>
                    </div>
                    <div class="settingsPage__socialCaption" v-if="socialsList.length == 0">Вы пока не добавили ни одного канала связи с вами</div>
                    <UIButton @click="isAddSocialModalOpened = true" class="settingsPage__socialButton" :style="'primary'">Добавить <i class="icon-plus inline-icon"></i></UIButton>
                </div>
            </div>

            <div class="settingsPage__title">Описание</div>
            <div class="settingsPage__block settingsPage__descriptionBlock">
                <UITextInput :placeholder="'Расскажите о компани...'" v-model:value="description"/>
                <UIButton :style="descriptionButtonStyle" @click="setDescription">Сохранить</UIButton>
            </div>

            <div class="settingsPage__title">Достижения</div>
            <div class="settingsPage__block">
                <div class="makerPage__achivement" v-for="(a, index) in achivesList" :key="index" :class="{skeleton: isAchivementsLoading}">
                    <UIAchievment :filename="a?.filename"/>
                </div>
                <div class="settingsPage__achivesCaption" v-if="achivesList?.length == 0">
                    У вас пока нет достижений
                </div>
            </div>

            <div class="settingsPage__title">Адрес компании</div>
            <div class="settingsPage__block settingsPage__block-adressBlock">
                <div class="settingsPage__adressInfo">
                    <UIInput class="adressHolder" v-model:value="adress" :placeholder="'Адресс компании'" :idOfInput="adressId"/>
                    <UIButton :style="adressButtonStyle" @click="saveAdress">Сохранить</UIButton>
                </div>
                <div class="settingsPage__adressMap" :id="mapId" :class="{skeleton: !map}">
                    {{mapErrorMessage}}
                </div>
            </div>
        </div>
        <div class="settingsPage__controlsFooter">
            <UIButton :style="'destructive'" @click="exit()">Выйти из аккаунта</UIButton>
            <UIButton :style="previewButtonStyle" @click="goToAccount">Предпросмтотр аккаунта</UIButton>
        </div>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UIInput from '@/components/FormComponents/UIInput.vue';
import UIImageLoader from '@/components/FormComponents/ImageLoaders/UIImageLoader.vue'
import UIModal from '@/components/UIModal.vue';
import UILoadingWall from '@/components/UILoadingWall.vue';
import UITextInput from '@/components/FormComponents/UITextInput.vue';
import UIRating from '@/components/FormComponents/UIRating.vue';
import UIAchievment from '@/components/UIAchievment.vue';

import { AdressHelper } from '@/helpers/AdressHelper.js'
import {UserDataController} from '@/helpers/UserDataController.js'
import {SettingsPageController, ADDRESS_SOCIAL_TITLE} from '@/maker/pages/settingsPage/helpers/settingsPageController.js'


export default {
    components: {
        UIHeader, UIButton, UIInput, UIImageLoader, UIModal, UILoadingWall,
        UITextInput, UIRating, UIAchievment,
    },

    data() {
        return {
            imageNew: false,
            imageSrc: undefined,
            name: "n",
            uuid: "n",
            role: "n",
            time: "n",
            description: '',
            descriptionButtonStyle: 'disabled',
            projectsCount: 0,
            isNumberApproved: false,
            number: "n",
            email: "n",
            totalLoading: false,
            isLoading: true,
            isSocialsLoading: false,
            buttonStyle: 'disabled',
            isAddSocialModalOpened: false,
            newSocialTitle: "",
            newSocialValue: "",
            adress: "",
            adressId: "maker_settingsPage_Adress",
            adressContact: {},
            adressButtonStyle: 'disabled',
            socialsList: [
                {title: 'Номер телефона', value: '89105834005', show: true, id: 0},
                {title: 'Номер телефона', value: '89105834006', show: true, id: 1},
                {title: 'Номер телефона', value: '89105834007', show: true, id: 2},
            ],
            achivesList: [{}, {}, {}],
            isAchivementsLoading: true,
            previewButtonStyle: "disabled",
            viewModel: new SettingsPageController(),
            rating: 0,
            map: undefined,
            mapId: "__adressMap__",
            mapErrorMessage: "Загрузка карты...",
        }
    },
    methods: {
        exit() {
            UserDataController.shared.exit()
        },

        goToAccount() {
            if (this.isLoading || !this.uuid) { 
                return
             }
            console.log("PUSH")
            this.$router.push('/user/makerPage/' + this.uuid)
        },

        async fetchData() {
            this.isLoading = true
            this.getAvatar()

            var data = await UserDataController.shared.getData()
            this.name = data?.firstname
            this.description = data?.description
            this.uuid = data?.uuid
            this.role = data?.role == "customer" ? "Заказчик" : "Исполнитель"
            this.projectsCount = data?.projectsCount
            this.email = data?.email
            this.isNumberApproved = Boolean(data?.phone)
            this.number = data?.phone

            const oneDay = 24 * 60 * 60 * 1000
            this.time = Math.max(Math.round((new Date(Date.now() - Date.parse(data?.registration_date))) / oneDay), 1)
            this.isLoading = false

            this.getAchievments()
            this.getRating()
        },

        async getSocials() {
            try {
                this.isSocialsLoading = true
                const socialsRaw = await this.viewModel.getSocials()

                this.socialsList = []
                for (let s of socialsRaw) {
                    if (s.Entity == ADDRESS_SOCIAL_TITLE) {
                        this.getAddress(s)
                        continue
                    }

                    let socialNew = {}
                    socialNew.id = s.id
                    socialNew.title = s.Entity
                    socialNew.value = s.contact_list[0].value
                    socialNew.show = true

                    this.socialsList.push(socialNew)
                }
            } catch(e) {
                console.log(e)
            } finally {
                this.isSocialsLoading = false
                this.adressButtonStyle = 'disabled'
            }
        },

        async addSocial() {
            try {
                this.totalLoading = true
                this.socialsList.push({
                    title: this.newSocialTitle,
                    value: this.newSocialValue,
                    show: true,
                })
                await this.viewModel.addSocial(this.newSocialTitle, this.newSocialValue)
            } catch(e) {
                //
            } finally {
                this.totalLoading = false
                this.isAddSocialModalOpened = false
                this.newSocialTitle = ""
                this.newSocialValue = ""
            }
        },

        async deleteSocial(index) {
            try {
                if (this.isSocialsLoading) { return }

                const removingItem = this.socialsList[index]

                var newSocials = [...this.socialsList]
                newSocials.splice(index, 1)

                this.totalLoading = true
                await this.viewModel.deleteSocial(removingItem.id, removingItem.value)
                this.socialsList = newSocials
            } catch(e) {
                console.log(e)
            } finally {
                this.totalLoading = false
            }
        },

        async setAvatar(file) {
            try {
                this.totalLoading = true
                await this.viewModel.setAvatar(file)
                UserDataController.shared.updateData()
            } catch(e) {
                //
            } finally {
                this.totalLoading = false
            }
        },

        async getAvatar() {
            try {
                this.imageSrc = await this.viewModel.getAvatarURL()
            } catch(e) {
                this.imageSrc = undefined
            }
        },

        async setName() {
            try {
                await this.viewModel.setName(this.name)
                UserDataController.shared.updateData()
            
                this.buttonStyle = 'disabled'
            } catch(e) {
                console.log(e)
                //
            }
        },

        async setDescription() {
            try {
                await this.viewModel.setDescription(this.description)
                UserDataController.shared.updateData()

                this.descriptionButtonStyle = 'disabled'
            } catch(e) {
                console.log(e)
                //
            }
        },

        async getAddress(s) {
            this.adress = s.contact_list[(s.contact_list?.length ?? 1) - 1].value
            this.adressContact.id = s.id
            this.adressContact.value = this.adress
            this.mapErrorMessage = ""
            AdressHelper.shared.getMapByAdress(this.mapId, this.adress, this.map)
                .then((response) => {
                    this.map = response
                })
                .catch((error) => {
                    console.log("ERROROROROOR", error)
                })
        },

        async saveAdress() {
            try {
                console.log(this.adress)
                AdressHelper.shared.getMapByAdress(this.mapId, this.adress, this.map)
                    .then((response) => {
                        this.map = response
                    })
                    .catch((error) => {
                        console.log("ERROROROROOR", error)
                    })
                await this.removeAdress()
                await this.viewModel.saveAdress(this.adress)
            } catch(e) {
                //
            } finally {
                this.adressButtonStyle = 'disabled'
            }
        },

        async removeAdress() {
            try {
                if (!this.adressContact?.id || !this.adressContact?.value) { return }
                await this.viewModel.deleteSocial(this.adressContact?.id, this.adressContact?.value)
                    .then((response) => {
                        console.log("RESP", response)
                    })
                    .catch((error) => {
                        console.log("ERROR", error)
                    })
            } catch(e) {
                //
            } finally {

            }
        },

        async getRating() {
            try {
                let ratingLocal = Number(await this.viewModel.getRating(this.uuid))
                if (isNaN(ratingLocal)) { return }
                this.rating = ratingLocal
            } catch(e) {
                console.log("ERROR", error)
            }
        },

        async getAchievments() {
            try {
                console.log("FETCHING ACHIEVMENTS")
                this.achivesList = await this.viewModel.getAchievments(this.uuid)
            } catch(e) {
                //
                console.log("ERROR", e)
            } finally {
                this.isAchivementsLoading = false
            }
        },

        switchSocialHidden(index) {
            if (this.isSocialsLoading) { return }
            this.socialsList[index].show = !this.socialsList[index].show
        },

    },
    computed: {
        daysAdding() {
            if (11 <= this.time % 100 && this.time % 100 <= 20) {
                return 'дней'
            } else if (this.time % 10 == 1) {
                return 'день'
            } else if (2 <= this.time % 10 && this.time % 10 <= 4) {
                return 'дня'
            } else if (5 <= this.time % 10 && this.time % 10 <= 9 || this.time % 10 == 0) {
                return 'дней'
            }
        }
    },
    mounted() {
        this.fetchData()
            .then(() => {
                this.buttonStyle = 'disabled'
                this.descriptionButtonStyle = 'disabled'
                this.previewButtonStyle = 'default'
            })
        this.getSocials()
            .then(() => {
                this.adressButtonStyle = 'disabled'
            })
        AdressHelper.shared.addToYMAP(this.adressId, (data) => {
            this.adress = data
        })
    },
    watch: {
        name: function() {
            this.buttonStyle = 'default'
        },
        adress: function() {
            this.adressButtonStyle = 'default'
        },
        description: function() {
            this.descriptionButtonStyle = 'default'
        },
    }
}
</script>

<style>

</style>