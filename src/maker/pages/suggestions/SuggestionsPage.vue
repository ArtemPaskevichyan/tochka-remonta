<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="titleText pageTitle">Предложенные мне проекты</div>
        <div class="suggestionsPage">
            <SuggestionsCard v-for="(s, index) in suggestions" :key="index" :projectId="s.id" :imageName="s.main_picture"
            :title="s.title" :description="s.description" :price="s.planned_budget_up" @accept="acceptSuggestion(s.sId, s.id)"/>
        </div>
        <div class="suggestionsPage__caption" v-if="suggestions?.length == 0">
            Никто ещё не предложил вам проект для сотрудничества
            <UIButton :style="'primary'" @click="$router.push('/maker/search')"><i class="icon-search inline-icon m-r"></i>Поиск проектов</UIButton>
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
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIHeader, SuggestionsCard, UIAlert, UIButton,
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
                        console.log("RESP", response)
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
            if (!confirm("Вы хотите стать исполнителем этого проекта?")) { return }
            
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
                            this.callError("Действие невозможно", "Испонитель этого проекта уже назначен", [{label: "ОК", callback: () => {this.isAlertOpened = false}, style: 'secondary'}])
                            break;
                        case "request already sent":
                            this.callError("Предложение существует", "Вы уже предложили исполнителю этот проект", [{label: "OK", callback: () => {this.isAlertOpened = false}, style: 'secondary'}])
                            break;
                    }
                })
        },

        callError(title, text, buttons) {
            this.errorToAlert.title = title
            this.errorToAlert.text = text
            this.errorToAlert.buttons = buttons
            this.isAlertOpened = true
        },
    },
    mounted() {
        this.getSuggestions()
    }
}
</script>