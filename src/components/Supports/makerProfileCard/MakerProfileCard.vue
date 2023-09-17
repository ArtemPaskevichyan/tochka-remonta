<template>
    <span class="makerProfileCard">
        <div class="makerProfileCard__info">
            <div class="makerProfileCard__content">
                <div class="makerProfileCard__infoLeftPart">
                    <div class="makerProfileCard__titleBlock">
                        <div class="makerProfileCard__title largeText" @click="$emit('goTo')" :class="{skeleton: !model?.firstname}">
                            {{ (!model?.firstname ||  model?.firstname?.length == 0) ? "<UNKNOWN>" : model.firstname}}
                        </div>
                        <div class="makerProfileCard__rating mobileOnly">
                            <UIRating :rating="rating"/>
                        </div>
                    </div>
                    <div class="makerProfileCard__text baseText" :class="{skeleton: !model?.description}">
                        {{ (!model?.description || model?.description?.length == 0) ? "Some description here" : model.description }}
                    </div>
                </div>

                <div class="makerProfileCard__infoRightPart">
                    <div class="makerProfileCard__logoHolder" @click="$emit('goTo')">
                        <img :src="avatarSrc" alt="" loading="lazy">
                    </div>
                    <div class="makerProfileCard__rating desktopOnly">
                        <UIRating :rating="rating"/>
                    </div>
                    <div class="makerProfileCard__achivements">
                        <UIAchievment class="makerProfileCard__achivement" v-for="(a, index) in achivements" :key="index" :class="{skeleton: isAchivementsLoading}" :filename="a?.filename"/>
                    </div>
                </div>
            </div>
            <div class="makerProfileCard__footer">
                <span v-if="this.cost != 0" class="makerProfileCard__cost baseText">{{ parseFloat(String(cost)).toLocaleString('ru') }} ₽/М²</span>
                <UIButton :style="'primary'" class="desktopOnly" @click="$emit('suggest')">Предложить сотрудничество</UIButton>
                <UIButton :style="'primary'" class="mobileOnly" @click="$emit('goTo')">Перейти к исполнителю</UIButton>
            </div>
        </div>

        <div class="makerProfileCard__projects">
            <div class="makerProfileCard__tile makerProfileCard__project">
                <img :src="projects[0]?.main_picture ? imageBaseURL + projects[0].main_picture : ''" alt="" loading="lazy" v-if="projects[0]?.main_picture">
            </div>
            <div class="makerProfileCard__tile makerProfileCard__project">
                <img :src="projects[1]?.main_picture ? imageBaseURL + projects[1].main_picture : ''" alt="" loading="lazy" v-if="projects[1]?.main_picture">
            </div>
            <div class="makerProfileCard__tile makerProfileCard__project">
                <img :src="projects[2]?.main_picture ? imageBaseURL + projects[2].main_picture : ''" alt="" loading="lazy" v-if="projects[2]?.main_picture">
            </div>
            <div class="makerProfileCard__tile makerProfileCard__additionalInfo">
                <div class="makerProfileCard__projectsCount" :class="{skeleton: projectsIsLoading}">
                    {{projectsLabel}}
                </div>
                <div class="makerProfileCard__projectDescription" v-if="projects?.length > 0" :class="{skeleton: projectsIsLoading}">
                    {{afterProjectsLabel}}
                </div>
                <UIButton class="makerProfileCard__projectButton" :style="projectsIsLoading ? 'disabled' : 'primary'"
                v-if="projects?.length > 0" @click="$emit('goTo')">
                    Посмотреть
                </UIButton>
            </div>
        </div>
    </span>
</template>

<script>
import UILink from '@/components/FormComponents/UILink.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UIRating from '@/components/FormComponents/UIRating.vue';
import UIAchievment from '@/components/UIAchievment.vue';
import { MakerDataController } from './makerDataControler';
import { serverURL } from '@/preferenses';

export default {
    components: {
        UILink, UIButton, UIRating, UIAchievment,
    },
    data() {
        return {
            makerDataController: new MakerDataController(),
            ratingIsLoading: true,
            projectsCountIsLoading: true,
            projectsIsLoading: true,
            rating: 0,
            // projectsCount: 10,
            projects: [{}, {}, {}],
            avatarName: "",
            cost: 0,
            avatarBaseURL: `${serverURL}/api/v1/auth/get_avatar?filename=`,
            imageBaseURL: `${serverURL}/api/v1/projects/get_event_photo?filename=`,
            achivements: [{}, {}, {}],
            isAchivementsLoading: true,
            description: undefined,
        }
    },
    props: {
        model: {
            type: Object,
            required: true,
        },
    },
    methods: {
        async getRating() {
            try {
                this.rating = (await this.makerDataController.getRating(this.model?.uuid))?.data?.rate
                this.$emit("ratingSetten", this.rating)
            } catch(e) {
                console.log("EE", e)
                //
            } finally {
                this.ratingIsLoading = false
            }
        },
        async getProjects() {
            try {
                this.projects = await this.makerDataController.getProjects(this.model?.uuid)
                this.projects.reverse()
            } catch(e) {
                //
            } finally {
                this.projectsIsLoading = false
            }
        },
        async getAchivements() {
            this.achivements = await this.makerDataController.getAchivements(this?.model?.uuid)
            this.isAchivementsLoading = false
        },
        async getModelAdditionalData() {
            this.makerDataController.getUserData(this?.model?.uuid)
                .then((response) => {
                    console.log("RESP", response)
                    this.cost = response?.data?.user?.square_meter_cost ?? 0
                    this.avatarName = response?.data?.user?.avatar ?? undefined
                    this.description = response?.data?.user?.description ?? "Описания нет"
                })
                .catch((error) => {
                    console.log("ERROR", error)
                })
        },
        onModelLoaded() {
            this.getRating()
            this.getProjects()
            this.getAchivements()
            this.getModelAdditionalData()
        },
    },
    watch: {
        model: function() {
            if (this.model?.firstname) {
                this.onModelLoaded()
            }
        }
    },
    mounted() {
        if (this.model?.firstname) {
            this.onModelLoaded()
        }
    },
    computed: {
        projectsLabel: function() {
            if (this.projects?.length == 0) {
                return "У исполнителя еще нет проектов"
            } else if (this.projects?.length % 10 == 1) {
                return "Всего " + this.projects?.length + " проект"
            } else if (this.projects?.length % 10 < 5) {
                return "Всего " + this.projects?.length + " проекта"
            } else if (this.projects?.length % 10 >= 5) {
                return "Всего " + this.projects?.length + " проектов"
            } else {
                return "У исполнителя еще нет проектов"
            }
        },
        afterProjectsLabel: function() {
            if (this.projects?.length == 1) {
                return "Завершен этим исполнителем. Посмотрите его в галерее"
            } else if (this.projects?.length > 1) {
                return "Завершено этим исполнителем. Посмотрите их в галерее"
            } else {
                return ""
            }
        },
        avatarSrc: function() {
            return this.avatarBaseURL + this.avatarName
        },
        imageSrc: function() {
            return this.imageBaseURL + this.image
        }
    }

}
</script>
