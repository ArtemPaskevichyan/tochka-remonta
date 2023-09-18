<template>
    <UIModal v-if="isAddSocialModalOpened" v-model:isOpened="isAddSocialModalOpened">
        <div class="settingsPage__addSocialModal" ref="modalContent">
            <div class="settingsPage__title">Добавление канала связи</div>
            <div class="settingsPage__addSocialModalInput" @click.stop>
                <UIInput v-model:value="newSocialTitle" :title="'Название канала'" :placeholder="'Социальная сеть/телефон'" @enterPressed="submitEnter"/>
                <div class="input__dropdown" v-if="contactsSuggestions?.length > 0">
                    <div class="input__dropdownItem" :key="index" v-for="(s, index) in contactsSuggestions" @click="choseItem(index)">
                        {{s}}
                    </div>
                </div>
            </div>
            <UIInput v-model:value="newSocialValue" :title="'Контент'" :placeholder="'Ссылка/номер телефона'" class="settingsPage__addSocialModalInput"/>
            <UIButton class="settingsPage__addSocialModalButton" :style="'primary'" @click="addSocial">Добавить</UIButton>
        </div>
    </UIModal>

    <UILoadingWall v-if="totalLoading"/>

    <div class="headerPage tabBarPage">
        <UIHeader/>
        <UITabBar :page="'Профиль'"/>
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
                    <div class="settingsPage__fullnessBlock">
                        <UIProgressBar :title="'Заполненность профиля'" :value="profileFillProgress"/>
                        <p class="baseText" :class="{warning: profileFillProgress < fullnessBarrier}" v-if="profileFillProgress < fullnessBarrier">
                            Чтобы пользоваться всеми возможностями платформы, заполенность вашего профиля должна составлять не менее {{ fullnessBarrier }}%
                        </p>
                    </div>
                </div>
            </div>

            <div class="settingsPage__title">Контакты</div>
            <div class="settingsPage__block">
                <div class="settingsPage__socials">
                    <div v-for="(s, index) in socialsList" :key="index" class="settingsPage__socialItem" :class="{hidden: !s.show, skeleton: isSocialsLoading}">
                        <div class="settingsPage__socialInfo">
                            <img class="settingsPage__socialIcon" v-if="s.iconSrc" :src="s.iconSrc"/><span>{{s.title}}</span><span class="settingsPage__socialSplitter">: </span><a v-if="s.href" :href="s.href">{{ s.value }}</a><span v-else>{{s.value}}</span>
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

            <div class="settingsPage__title">Стоимость работ</div>
            <div class="settingsPage__block settingsPage__descriptionBlock">
                <UICleaveInput class="settingsPage__cost" :placeholder="'1 000 000'" v-model:value="cost" :suffix="'₽/М²'" :class="{error: costError}" :role="'positiveInt'" :size="'short'"/>
                <UIButton :style="costButtonStyle" @click="setCost">Сохранить</UIButton>
            </div>

            <div class="settingsPage__title">Достижения</div>
            <div class="settingsPage__block settingsPage__achivements">
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
                <div class="settingsPage__adressMap" :id="mapId" :class="{skeleton: mapIsLoading}">
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
import UITabBar from '@/components/UITabBar.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UIInput from '@/components/FormComponents/UIInput.vue';
import UIImageLoader from '@/components/FormComponents/ImageLoaders/UIImageLoader.vue'
import UIModal from '@/components/UIModal.vue';
import UILoadingWall from '@/components/UILoadingWall.vue';
import UITextInput from '@/components/FormComponents/UITextInput.vue';
import UIRating from '@/components/FormComponents/UIRating.vue';
import UIAchievment from '@/components/UIAchievment.vue';
import UIParamInput from '@/components/FormComponents/UIParamInput.vue';
import UICleaveInput from "@/components/FormComponents/UICleaveInput.vue";

import { AdressHelper } from '@/helpers/AdressHelper.js'
import { UserDataController } from '@/helpers/UserDataController.js'
import { SettingsPageController, ADDRESS_SOCIAL_TITLE } from '@/maker/pages/settingsPage/helpers/settingsPageController.js'
import { socialsArray } from '@/preferenses.js'
import UIProgressBar from "@/components/UIProgressBar.vue";
import { makerProfileFullnessLimit } from "@/preferenses";



export default {
    components: {
        UIHeader, UIButton, UIInput, UIImageLoader, UIModal, UILoadingWall,
        UITextInput, UIRating, UIAchievment, UITabBar, UIParamInput, UICleaveInput,
        UIProgressBar,
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
            mapIsLoading: true,
            mapId: "__adressMap__",
            mapErrorMessage: "Загрузка карты...",
            cost: "",
            costButtonStyle: "disabled",
            costError: false,
            contactsSuggestions: [],
            profileFillProgress: 0,
            fullnessBarrier: makerProfileFullnessLimit,
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
            this.profileFillProgress = data?.profileFullness
            this.number = data?.phone

            this.cost = data?.square_meter_cost
            if (this.cost == 0) this.cost = ""

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
                let adressIsFound = false

                this.socialsList = []
                for (let s of socialsRaw) {
                    if (s.Entity == ADDRESS_SOCIAL_TITLE) {
                        this.getAddress(s)
                        adressIsFound = true
                        continue
                    }

                    let socialNew = {
                        id: s.id,
                        title: s.Entity,
                        value: s.contact_list[0].value,
                        show: true,
                    }

                    for (let social of socialsArray) {
                        if (social.name == socialNew.title) { 
                            socialNew.iconSrc = new URL(`../../../assets/images/${social.imageName}`, import.meta.url).href;
                            socialNew.href = social.hrefBuilder(String(socialNew.value))
                            break;
                        }
                    }

                    this.socialsList.push(socialNew)
                }

                if (!adressIsFound) this.mapErrorMessage = "Исполнитель ещё не добавил адрес"
            } catch(e) {
                console.log(e)
            } finally {
                this.isSocialsLoading = false
                this.adressButtonStyle = 'disabled'
                this.mapIsLoading = false
            }
        },

        async addSocial() {
            try {
                this.totalLoading = true
                // this.socialsList.push({
                //     title: this.newSocialTitle,
                //     value: this.newSocialValue,
                //     show: true,
                // })
                await this.viewModel.addSocial(this.newSocialTitle, this.newSocialValue)
                await this.getSocials()
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
                await UserDataController.shared.updateData()
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
                this.totalLoading = true
                await this.viewModel.setName(this.name)
                await UserDataController.shared.updateData()
            
                this.buttonStyle = 'disabled'
            } catch(e) {
                console.log(e)
            } finally {
                this.totalLoading = false
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

        async getAddress(s, forceGet=false) {
            if (!forceGet) {
                this.adress = s.contact_list[(s.contact_list?.length ?? 1) - 1].value
                this.adressContact.id = s.id
                this.adressContact.value = this.adress
                this.mapErrorMessage = ""
            }
            AdressHelper.shared.getMapByAdress(this.mapId, this.adress, this.map)
                .then((response) => {
                    this.map = response
                })
                .catch((error) => {
                    this.mapErrorMessage = "Указан некорректный адрес"
                    if (this.adress == "") {
                        this.mapErrorMessage = "Указан пустой адрес"
                    }
                    console.log("ERROR", error)
                })
        },

        async saveAdress() {
            try {
                AdressHelper.shared.getMapByAdress(this.mapId, this.adress, this.map)
                    .then((response) => {
                        this.mapErrorMessage = ""
                        this.map = response
                    })
                    .catch((error) => {
                        console.log("ERROR", error)
                    })
                await this.removeAdress()  // to not duplicate adress contact
                await this.viewModel.saveAdress(this.adress)
                await getAddress("", true)
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

        async setCost() {
            try {
                this.isLoading = true
                await this.viewModel.setCost(this.cost)
                await UserDataController.shared.updateData()

                this.costButtonStyle = 'disabled'
            } catch(e) {
                if (e.message == "NaN") this.costError = true
            } finally {
                this.isLoading = false
            }
        },

        switchSocialHidden(index) {
            if (this.isSocialsLoading) { return }
            this.socialsList[index].show = !this.socialsList[index].show
        },

        choseItem(index) {
            this.newSocialTitle = this.contactsSuggestions[index]
            setTimeout(() => { this.contactsSuggestions = [] }, 10)
            
        },

        getSuggestions() {
            this.$refs.modalContent.removeEventListener('click', this.clickOutsideHandler)
            this.$refs.modalContent.addEventListener('click', this.clickOutsideHandler, { once: true })

            const someOfKeysHas = (key) => { return key.includes(this.newSocialTitle.toLocaleLowerCase()) }
            const exists = (src) => { return src.keywords.some(someOfKeysHas) }

            this.contactsSuggestions = socialsArray.filter(exists).map(e => e.name)
        },

        submitEnter(inputElement) {
            this.contactsSuggestions = []
            inputElement.target.blur()
        },

        clickOutsideHandler() {
            this.contactsSuggestions = []
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
                this.costButtonStyle = 'disabled'
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
        cost: function() {
            this.costButtonStyle = 'default'
            this.costError = false
        },
        newSocialTitle: function() {
            this.getSuggestions()
        },
    },
    beforeUnmount() {
        try {
            this.$refs.modalContent.removeEventListener('click', this.clickOutsideHandler)
        } catch(e) {
            console.log(e)
        }
    }
}
</script>

<style>

</style>