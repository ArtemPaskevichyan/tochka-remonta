<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="makerPage backgroundCard">

            <div class="makerPage__makerCard">
                <div class="makerPage__makerLogoHolder" :class="{skeleton: isMakerLoading}">
                    <img :src="avatarURL" alt="" v-if="maker?.avatar">
                </div>
                <div class="makerPage__makerInfo">
                    <div class="makerPage__makerTitle titleText" :class="{skeleton: isMakerLoading}">
                        {{ maker?.firstname ?? "TITLE"}}
                    </div>
                    <div class="makerPage__rating">
                        <UIRating :rating="maker?.rating ?? 0"/>
                    </div>
                    <div class="makerPage__controls">
                        <span class="makerPage__contactsButton">
                            <UIButton :style="maker?.avatar ? 'secondary' : 'disabled'" @click="smoothScrollTo('#MPContacts')">Контакты</UIButton>
                            <UIButton
                                :style="maker?.avatar ? 'secondary square' : 'disabeld'"
                                title="Написать пользователю"
                                @click="goToChat"
                            >
                                <i class="icon-chat"></i>
                            </UIButton>
                        </span>
                        <UIButton :style="maker?.avatar ? 'primary' : 'disabled'" @click="openSuggestModal">Предложить проект</UIButton>
                    </div>
                </div>
            </div>

            <div class="makerPage__block">
                <div class="makerPage__blockTitle">Достижения</div>
                <div class="makerPage__achivementHolder">
                    <div class="makerPage__achivement" v-for="(a, index) in achivements" :key="index" :class="{skeleton: isAchivementsLoading}">
                        <UIAchievment :filename="a?.filename"/>
                    </div>
                </div>
                <div class="makerPage__caption" v-if="achivements?.length == 0">
                    Исполнитель ещё не получил никаких достижений
                </div>
            </div>

            <div class="makerPage__block">
                <div class="makerPage__blockTitle">Описание</div>
                <div class="makerPage__description baseText" :class="{skeleton: isMakerLoading, makerPage__caption: !maker?.description}">
                    {{ maker?.description ?? "Исполнитель не оставил о себе описание"}}
                </div>
            </div>

            <div class="makerPage__block">
                <div class="makerPage__blockTitle">Выполненные проекты</div>
                <ArchiveProjectCard v-for="proj in projects" :title="proj.title" :projectId="proj.id" :key="proj.id" :isLoading="isProjectsLoading"
                :status="'Поиск исполнителя'" :imageName="proj.main_picture" :description="proj.description" :rating="proj.rating" @action="goToProject(proj.id)"/>
                <div class="makerPage__caption" v-if="projects?.length == 0">
                    У исполнителя пока нет выполненных проектов
                </div>
            </div>

            <div class="makerPage__description baseText" :class="{skeleton: isMakerLoading, makerPage__caption: !maker?.description}">
                Стоимость работ: {{ maker.square_meter_cost }} ₽/М²
            </div>

            <div class="makerPage__block">
                <div class="makerPage__blockTitle">Отзывы</div>
                <Review class="makerPage__review" :model="r" v-for="(r, index) in reviews" :key="index" :isLoading="isReviewsLoading"/>
                <div class="makerPage__caption" v-if="reviews?.length == 0">
                    Никто ещё не оставил отзыв о работе исполнителя
                </div>
            </div>

            <div class="makerPage__block" id="MPContacts">
                <div class="makerPage__blockTitle">Контакты</div>
                <div class="makerPage__contactsBlock">
                    <div class="makerPage__contacts">
                        <div class="makerPage__contact baseText" v-for="(c, index) in contacts" :key="index" :class="{skeleton: isContactsLoading}">
                            {{c.title}} : {{c.value}}
                        </div>
                        <div class="makerPage__caption" v-if="!contacts || contacts.length == 0">
                            Исполнитель не добавил каналы связи
                        </div>
                    </div>
                    <div class="makerPage__map" :class="{skeleton: !map}" :id="mapId">
                        {{ mapErrorMessage }}
                    </div>
                </div>
            </div>

            <div class="makerPage__footer">
                <UIButton :style="maker?.avatar ? 'secondary' : 'disabled'" @click="goToChat"><i class="icon-chat m-r"></i>Написать исполнителю</UIButton>
                <UIButton :style="maker?.avatar ? 'primary' : 'disabled'" @click="openSuggestModal">Предложить сотрудничество</UIButton>
            </div>
        </div>

        <UIModal v-if="isSuggestOpened" v-model:isOpened="isSuggestOpened">
            <SuggestProject :makerModel="maker"/>
        </UIModal>
    </div>
</template>

<script>
import { MakerPageController } from '@/user/pages/makerPage/helpers/makerPageControler.js'
import { ADDRESS_SOCIAL_TITLE } from '@/maker/pages/settingsPage/helpers/settingsPageController.js'
import { AdressHelper } from '@/helpers/AdressHelper.js'

import UIHeader from '@/components/Header/UIHeader.vue'
import SuggestProject from '@/user/pages/components/SuggestProject.vue'
import UIModal from '@/components/UIModal.vue'
import UIButton from '@/components/Buttons/UIButton.vue'
import UIRating from '@/components/FormComponents/UIRating.vue'
import { serverURL } from '@/preferenses.js'
import ArchiveProjectCard from '@/components/ProjectCards/ArchiveProjectCard.vue'
import Review from '@/components/Supports/Review.vue'
import UIAchievment from '@/components/UIAchievment.vue'

export default {
    components: {
        UIHeader, SuggestProject, UIModal, UIButton, UIRating,
        ArchiveProjectCard, Review, UIAchievment,

    },
    data() {
        return {
            makerPageController: new MakerPageController(),
            isMakerLoading: false,
            maker: {},
            isAchivementsLoading: false,
            achivements: [{}, {}, {}, {}],
            isProjectsLoading: false,
            projects: [{}, {}, {}],
            isReviewsLoading: true,
            reviews: [{}, {}, {}],
            isContactsLoading: false,
            contacts: [
                {Entity: 'email', contact_list: [{value: 'example@mail.com'}]},
                {Entity: 'email', contact_list: [{value: 'example@mail.com'}]},
                {Entity: 'email', contact_list: [{value: 'example@mail.com'}]},
            ],
            isSuggestOpened: false,
            avatarBaseURL: serverURL + '/api/v1/auth/get_avatar?filename=',
            map: undefined,
            mapId: "__adressMap__",
            mapErrorMessage: "Загрузка карты...",
        }
    },
    methods: {
        async getData() {
            try {
                this.isMakerLoading = true
                this.maker = await this.makerPageController.getData(this.uuid)
                this.maker.rating = await this.makerPageController.getRating(this.uuid)
            } catch(e) {
                //
            } finally {
                this.isMakerLoading = false
            }
            
        },

        async getAchivements() {
            try {
                this.isAchivementsLoading = true
                this.achivements = await this.makerPageController.getAchivements(this.uuid)
            } catch(e) {
                console.log(e)
                //
            } finally {
                this.isAchivementsLoading = false
            }
        },

        async getProjects() {
            try {
                this.isProjectsLoading = true
                this.projects = await this.makerPageController.getProjects(this.uuid)

                for (let i = 0; i < this.projects.length; i++) {
                    this.makerPageController.getProjectRating(this.projects[i].id)
                        .then((response) => {
                            this.projects[i].rating = response?.data?.stars
                        })
                }
            } catch(e) {
                console.log(e)
                //
            } finally {
                this.isProjectsLoading = false
            }
        },

        async handleReviewsData() {
            for (let i = 0; i < this.reviews?.length; i++) {
                this.makerPageController.getUserInfo(this.reviews[i]?.project_data?.customer_uuid)
                    .then((response) => {
                        this.reviews[i].username = response?.firstname
                        this.reviews[i].img = response?.avatar
                    })
            }
        },

        async getReviews() {
            try {
                this.isReviewsLoading = true
                await this.makerPageController.getReviews(this.uuid)
                    .then((response) => {
                        this.reviews = response?.data?.review_list ?? []
                        this.handleReviewsData()
                    })
            } catch(e) {
                //
            } finally {
                this.isReviewsLoading = false
            }
        },

        async getContacts() {
            try {
                this.isContactsLoading = true
                const contactsRaw = await this.makerPageController.getContacts(this.uuid)

                this.contacts = []
                for (let c of contactsRaw) {
                    if (c.Entity == ADDRESS_SOCIAL_TITLE) {
                        let address = c.contact_list[0].value
                        if (!address || address.length == 0) {
                            this.mapErrorMessage = "Испольнитель некорректно указал адрес"
                            this.map = true
                            continue
                        }

                        this.contacts.push({title: "Адрес", value: c.contact_list[(c.contact_list?.length ?? 1) - 1].value, id: c.id})
                        this.getMapForAddress(address)
                        continue
                    }

                    let contactNew = {}
                    contactNew.id = c.id
                    contactNew.title = c.Entity
                    contactNew.value = c.contact_list.map(v => v.value).join(", ")

                    this.contacts.push(contactNew)
                }
            } catch(e) {
                //
            } finally {
                this.isContactsLoading = false
            }
        },

        async getMapForAddress(address) {
            this.mapErrorMessage = ""
            AdressHelper.shared.getMapByAdress(this.mapId, address, this.map)
                .then((response) => {
                    this.map = response
                })
                .catch((error) => {
                    console.log("ERROROROROOR", error)
                })
        },

        openSuggestModal() {
            if (this.isMakerLoading) { return }
            this.isSuggestOpened = true
        },

        smoothScrollTo(selector) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $(selector).offset().top - 200
            }, 350);
        },

        async goToProject(id) {
            this.$router.push(await this.makerPageController.goToProject(id))
        },

        goToChat() {
            this.$router.push({name: 'chat', query: {command: "go", value: `/direct/${this.uuid}`}})
        },
    },
    props: {
        uuid: {
            type: String,
            required: true,
        }
    },
    computed: {
        avatarURL: function() {
            return this.maker?.avatar ? this.avatarBaseURL + this.maker?.avatar : ''
        }
    },
    mounted() {
        this.getData()
        this.getAchivements()
        this.getProjects()
        this.getReviews()
        this.getContacts()
    },
}
</script>