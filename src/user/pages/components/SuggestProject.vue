<template>
    <div class="suggestProject">
        <div class="suggestProject__maker">
            <div class="suggestProject__makerLogo">
                <img :src="avatarURL" alt="">
            </div>
            <div class="suggestProject__makerInfo">
                <div class="suggestProject__makerTitle titleText">{{ makerModel?.firstname ?? 'TITLE'}}</div>
                <UIRating :rating="makerModel?.rating ?? 0"/>
            </div>
        </div>
    
        <div class="suggestProject__notation baseText">
            Вы можете предложить исполнителю ваш проект для реализации. Ему придет уведомление о новом предложении
        </div>
    
        <div class="suggestProject__projects">
            <div class="suggestProject__projectsTitle largeText">
                Мои проекты
            </div>
            <SuggestProjectCard class="suggestProject__projectsCard" v-for="p in projectsList"  :isLoading="isProjectListLoading"
            :key="p.id" :title="p.title ?? 'UNTITLED'" :projectId="p.id" :status="'Поиск исполнителя'" :imageName="p.main_picture"/>
            <div class="suggestProject__projectsCaption" v-if="projectsList?.length == 0">
                Проекты, доступные для предложения, не найдены
            </div>
        </div>
    </div>
</template>

<script>
import { serverURL } from '@/preferenses'
import UIRating from '@/components/FormComponents/UIRating.vue'
import SuggestProjectCard from '@/components/ProjectCards/SuggestProjectCard.vue'
import { SuggestProjectController } from '@/user/pages/components/suggestProjectController.js'

export default {
    components: {
        UIRating, SuggestProjectCard,
    },
    data() {
        return {
            isProjectListLoading: false,
            projectsList: [{}, {}],
            avatarBaseURL: `${serverURL}/api/v1/auth/get_avatar?filename=`,
            imageBaseURL: `${serverURL}/api/v1/projects/get_event_photo?filename=`,
            viewController: new SuggestProjectController(),
        }
    },
    props: {
        makerModel: {
            type: Object,
            required: true,
        }
    },
    methods: {
        async getProjects() {
            try {
                this.isProjectListLoading = true,
                this.projectsList = await this.viewController.getProjects()
            } catch(e) {
                //
            } finally {
                this.isProjectListLoading = false
            }
        }
    },
    computed: {
        avatarURL: function() {
            return this.makerModel?.avatar ? this.avatarBaseURL + this.makerModel?.avatar : ''
        }
    },
    mounted() {
        this.getProjects()
    }
}
</script>