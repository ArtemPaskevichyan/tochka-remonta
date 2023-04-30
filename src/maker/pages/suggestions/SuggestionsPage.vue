<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="titleText pageTitle">Предложенные мне проекты</div>
        <div class="suggestionsPage">
            <SuggestionsCard v-for="(s, index) in suggestions" :key="index" :projectId="s.id" :imageName="s.main_picture"
            :title="s.title" :description="s.description" :price="s.planned_budget_up" @accept="acceptSuggestion(s.sId, s.id)"/>
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
import UIHeader from '@/components/Header/UIHeader.vue'
import SuggestionsCard from './SuggestionsCard.vue';
import { SuggestionsController } from "./helpers/suggestionsController.js"
import UIAlert from '@/components/UIAlert.vue';

export default {
    components: {
        UIHeader, SuggestionsCard, UIAlert,
    },
    data() {
        return {
            isLoading: false,
            suggestions: [{}, {}, {}],
            suggestionsController: new SuggestionsController(),
            isAlertOpened: false,
            errorToAlert: {
                buttons: [],
                title: "",
                text: "",
            },
        }
    },
    methods: {
        async getSuggestions() {
            var suggestionsPrevious = await this.suggestionsController.getSuggestions()
            console.log(suggestionsPrevious)
            this.suggestions = [...Array(suggestionsPrevious?.length)].map(e=>{})
            for (let i = 0; i < suggestionsPrevious.length; i++) {
                const projectId = suggestionsPrevious[i]?.project_id
                this.suggestionsController.getProjectData(projectId)
                    .then((response) => {
                        this.suggestions[i] = response?.data?.project ?? {}
                        this.suggestions[i].sId = suggestionsPrevious[i]?.id
                        this.suggestions[i].from = suggestionsPrevious[i]?.from
                        this.suggestions[i].to = suggestionsPrevious[i]?.to
                    })
                    .catch((error) => {
                        console.log("GETSUGGESTIONPAGEPROJECTERROR", error)
                    })
            }
        },

        async acceptSuggestion(sId, pId) {
            if (!sId) { return }
            
            this.suggestionsController.acceptSuggestion(sId)
                .then((response) => {
                    console.log("RESP", response)
                    this.$router.push('/maker/project/' + pId)
                })
                .catch((error) => {
                    console.log("ERROR", error)
                    var dataMsg = error?.response?.data?.msg ?? error.message

                    switch(dataMsg) {
                        case "contractor already set":
                            this.callError("Действое невозможно", "Испонитель этого проекта уже назначен", {label: "ОК", callback: () => {this.isAlertOpened = false}})
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
    mounted() {
        this.getSuggestions()
    }
}
</script>