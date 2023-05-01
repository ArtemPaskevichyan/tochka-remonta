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
            :key="p.id" :title="p.title ?? 'UNTITLED'" :projectId="p.id" :status="'Поиск исполнителя'" :imageName="p.main_picture"
            @suggest="sendSuggestion"/>
            <div class="suggestProject__projectsCaption" v-if="projectsList?.length == 0">
                Проекты, доступные для предложения, не найдены
            </div>
        </div>
    </div>

    <UIAlert v-if="isAlertOpened" v-model:isOpened="isAlertOpened">
        <template v-slot:body>
            <div class="alert__baseTitle" v-if="errorToAlert?.title">
                {{errorToAlert?.title}}
            </div>
            <div class="alert__baseText" v-if="errorToAlert?.text">
                {{errorToAlert?.text}}
            </div>
        </template>
        <template v-slot:controls>
            <UIButton :style="b?.style" @click="b?.callback" :key="index" v-for="(b, index) in errorToAlert?.buttons">{{ b?.label }}</UIButton>
        </template>
    </UIAlert>
</template>

<script>
import { serverURL } from '@/preferenses'
import UIRating from '@/components/FormComponents/UIRating.vue'
import SuggestProjectCard from '@/components/ProjectCards/SuggestProjectCard.vue'
import { SuggestProjectController } from '@/user/pages/components/suggestProjectController.js'
import UIAlert from '@/components/UIAlert.vue'
import UIButton from '@/components/Buttons/UIButton.vue'

export default {
    components: {
        UIRating, SuggestProjectCard, UIAlert, UIButton,
    },
    data() {
        return {
            isProjectListLoading: false,
            projectsList: [{}, {}],
            avatarBaseURL: `${serverURL}/api/v1/auth/get_avatar?filename=`,
            imageBaseURL: `${serverURL}/api/v1/projects/get_event_photo?filename=`,
            viewController: new SuggestProjectController(),
            isAlertOpened: false,
            errorToAlert: {
                buttons: [],
                title: "",
                text: "",
            },

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
        },

        async sendSuggestion(p_id) {
            if (!confirm("Вы хотите предложить проект этому исполнителю?")) { return }

            this.viewController.sendSuggestion(p_id, this.makerModel?.uuid)
                .then((response) => {
                    console.log("RESP", response)
                    this.isAlertOpened = false
                })
                .catch((error) => {
                    console.log("ERROR", error)
                    let msg = error?.response?.data?.msg ?? error.message

                    switch(msg) {
                        case 'request already sent':
                            this.callError("Предложение существует", "Вы уже предложили исполнителю этот проект", [{label: "OK", callback: () => {this.isAlertOpened = false}, style: 'secondary'}])
                            break;
                    }
                })
        },
        callError(title, text, buttons) {
            this.isAlertOpened = true
            this.errorToAlert.title = title
            this.errorToAlert.text = text
            this.errorToAlert.buttons = buttons
        },
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