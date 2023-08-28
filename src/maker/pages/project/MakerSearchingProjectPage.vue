<template>
    <div class="headerPage">
        <UIHeader/>
        <span class="titleText pageTitle shortened" :class="{skeleton: !hasProject}">{{ project?.title ?? 'Название проекта'}}</span>
        <div class="projectSearchingPage backgroundCard">
            <UIGalery :imageNames="imageNames" :orientation="'h'"/>
            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">О проекте</div>
                <span class="projectSearchingPage__parameterTitle">Квадратура: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{(project?.square_meters ?? '100000') + " М²"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Возраст дома: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{houseNew ?? "skeleton new"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Тип дома: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{project?.house_type ?? "skeleton type"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Город: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{project?.city ?? "skeleton city"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Адрес объекта: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{project?.address ?? "skeleton address"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Примерная дата старта: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{startDate ?? Date.now()}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Стоимость: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{(project?.planned_budget_down + ' — ' + project?.planned_budget_up + ' ₽') ?? "some skeleton budget"}}
                </span><br>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Описание</div>
                <div class="projectSearchingPage__description" :class="{skeleton: !hasProject}">
                    {{project?.description ?? "some description for sceleton loader"}}
                </div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__actions">
                    <UIButton :style="'secondary'"
                        @click="$router.push({name: 'chat', query: {command: 'go', value: `/direct/${project.customer_uuid}`}})"
                    >
                        <i class="icon-chat m-r"></i>Написать заказчику
                    </UIButton>
                    <UIButton :style="'primary'" @click="sendResponse">Откликнуться</UIButton>
                </div>
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
    <UILoadingWall v-if="isLoading"/>
</template>

<script>
import UIGalery from '@/components/Galery/UIGalery.vue'
import UIHeader from '@/components/Header/UIHeader.vue';
import UILink from '@/components/FormComponents/UILink.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UILoadingWall from '@/components/UILoadingWall.vue';
import UIAlert from '@/components/UIAlert.vue'
import { convertDateToBase } from '@/helpers/DateConverter';

export default {
    components: {
        UIGalery, UIHeader, UILink, UIButton,
        UILoadingWall, UIAlert,
    },
    data() {
        return {
            isLoading: false,
            isAlertOpened: false,
            errorToAlert: {
                buttons: [],
                title: "",
                text: "",
            },
        }
    },
    props: {
        project: {
            type: Object,
            required: true,
        },
        imageNames: {
            type: Array,
            required: true,
        },
        projectController: {
            type: Object,
            required: true,
        },
    },
    methods: {
        async sendResponse() {
            try {
                this.isLoading = true
                let response = await this.projectController.sendResponse(this.project?.id, this.project?.customer_uuid)

                if (response?.data?.msg == "you joined to this project") {
                    this.callInviteAlert()
                } else if (response?.data?.msg == "request already sent") {
                    this.callError("Предложение существует", "Вы уже предложили исполнителю этот проект", [{label: "OK", callback: () => {this.isAlertOpened = false}, style: 'secondary'}])
                } else {
                    this.$router.push("/maker/myProjects")
                }
            } catch(error) {
                let dataMsg = error?.response?.data?.msg ?? error.message

                switch(dataMsg) {
                    case "contractor already set":
                        this.callError("Действие невозможно", "Испонитель этого проекта уже назначен", [{label: "ОК", callback: () => {this.isAlertOpened = false}, style: 'secondary'}])
                        break;
                    case "request already sent":
                        this.callError("Предложение существует", "Вы уже предложили свою роль исполнителя этого проекта", [
                            {label: "OK", callback: () => {this.isAlertOpened = false}, style: 'secondary'},
                            {style: "primary", callback: () => this.$router.push({ name: "makerOutcomingSuggestions" }), label: "К предложению"},
                        ])
                        break;
                }
            } finally {
                this.isLoading = false
            }
        },
        callInviteAlert() {
            this.errorToAlert.title = "Встречное предложение!"
            this.errorToAlert.text = "Заказчик уже предложил Вам сотрудничество по этому проекту. Примите его, чтобы начать работу."
            this.errorToAlert.buttons = [
                {style: "secondary", callback: () => {this.isAlertOpened = false}, label: "Отмена"},
                {style: "primary", callback: this.goToSuggestions, label: "К предложенным мне"},
                // {style: "primary", callback: this.goToSuggestions, label: "К предложенным мне"},
            ]
            this.isAlertOpened = true
        },
        goToSuggestions() {
            this.$router.push("/maker/suggestions")
        },
        callError(title, text, buttons) {
            this.errorToAlert.title = title
            this.errorToAlert.text = text
            this.errorToAlert.buttons = buttons
            this.isAlertOpened = true
        },
    },
    computed: {
        hasProject: function() {
            return Boolean(this.project) 
        },
        houseNew: function() {
            if (this.project?.is_new_building == undefined) {
                return undefined
            } else {
                return this.project?.is_new_building ? "Новостройка" : "Вторичка"
            }
        },
        startDate: function() {
            return convertDateToBase(this.project?.start_date)
        }
    },
}
</script>

<style>

</style>