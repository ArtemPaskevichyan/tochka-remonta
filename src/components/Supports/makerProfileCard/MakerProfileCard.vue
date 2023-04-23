<template>
    <span class="makerProfileCard">
        <div class="makerProfileCard__info">
            <div class="makerProfileCard__content">
                <div class="makerProfileCard__infoLeftPart">
                    <div class="makerProfileCard__title largeText" @click="" :class="{skeleton: !model?.firstname}">
                        {{ (!model?.firstname ||  model?.firstname?.length == 0) ? "<UNKNOWN>" : model.firstname}}
                    </div>
                    <div class="makerProfileCard__text baseText" :class="{skeleton: !model?.description}">
                        {{ (!model?.description || model?.description?.length == 0) ? "Some description here" : model.description }}
                    </div>
                </div>

                <div class="makerProfileCard__infoRightPart">
                    <div class="makerProfileCard__logoHolder">
                        <img :src="avatarSrc" alt="" loading="lazy">
                    </div>
                    <div class="makerProfileCard__rating">
                        <UIRating :rating="rating"/>
                    </div>
                    <div class="makerProfileCard__achivements">
                        
                    </div>
                </div>
            </div>
            <div class="makerProfileCard__footer">
                <UIButton :style="'primary'" @click="$emit('suggest')">Предложить проект</UIButton>
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
import { MakerDataController } from './makerDataControler';
import { serverURL } from '@/preferenses';

export default {
    components: {
        UILink, UIButton, UIRating,
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
            avatarBaseURL: `${serverURL}/api/v1/auth/get_avatar?filename=`,
            imageBaseURL: `${serverURL}/api/v1/projects/get_event_photo?filename=`,
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
        onModelLoaded() {
            this.getRating()
            this.getProjects()
        }
    },
    watch: {
        model: function() {
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
            return this.avatarBaseURL + this.model?.avatar
        },
        imageSrc: function() {
            return this.imageBaseURL + this.image
        }
    }

}
</script>
