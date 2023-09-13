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
                    <UIButton :style="'destructive'" @click="deleteProject">Удалить</UIButton>
                    <!-- <UIButton :style="'default'" @click="editProject">Редактировать</UIButton> -->
                </div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">
                    Отклики
                    <!-- <UILink :class="{skeleton: !hasProject}" :size="'small'" :link="`/user/projectResponses/${project?.id ?? 'none'}`">
                        Все отклики
                    </UILink> -->
                </div>
                <div class="projectSearchingPage__caption" v-if="listOfResponses?.length == 0 || !listOfResponses">
                    Пока никто не откликнулся на ваш проект
                </div>
                
                <MakerResponseCard v-for="resp in listOfResponses" :key="resp.id" :model="resp?.maker" @goToMaker="goToMaker(resp.from)" @setMaker="setMaker(resp.id)"/>
            </div>
        </div>
    </div>

    <UILoadingWall v-if="isLoading"/>
</template> 

<script>
import UIGalery from '@/components/Galery/UIGalery.vue'
import UIHeader from '@/components/Header/UIHeader.vue';
import UILink from '@/components/FormComponents/UILink.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UILoadingWall from '@/components/UILoadingWall.vue';
import MakerResponseCard from '@/components/Supports/MakerResponseCard.vue';

import { convertDateToBase } from '@/helpers/DateConverter';

export default {
    components: {
        UIGalery, UIHeader, UILink, UIButton, UILoadingWall,
        MakerResponseCard,
    },
    data() {
        return {
            listOfResponses: [
                
            ],
            isLoading: false,
            isResponsesLoading: false,
        }
    },
    props: {
        project: {
            type: Object,
        },
        required: true,
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
        async getResponsesList() {
            this.isResponsesLoading = true
            this.listOfResponses = (await this.projectController.getResponsesList(this.project?.id))?.requests
            this.isResponsesLoading = false

            for (let i = 0; i < this.listOfResponses.length; i++) {
                this.projectController.getDataForResponse(this.listOfResponses[i]?.from)
                    .then((data) => {
                        this.listOfResponses[i].maker = data
                    })
                    .catch((error) => {

                    })
            }
        },
        async deleteProject() {
            try {
                this.isLoading = true
                await this.projectController.deleteProject(this.project?.id)
                    .then((response) => {
                        if (response) {this.$router.push('/user/myProjects')}
                    })
                    .cathc((error) => {

                    })
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
        },
        editProject() {
            try {
                this.projectController.editProject(this.project?.id)
            } catch(e) {
                //
            }
        },
        async setMaker(id) {
            try {
                this.isLoading = true
                await this.projectController.setMaker(id)
                await this.projectController.setProjectStatus(this.project?.id)
                window.location.reload();
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
        },
        goToMaker(uuid) {
            try {
                this.$router.push('/user/makerPage/' + uuid)
            } catch(e) {
                //
            }
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
    mounted() {
        this.getResponsesList()
    },
    watch: {
        project: function() {
            if (!this.project?.id) { return }

            this.getResponsesList()
        }
    }
}
</script>

<style>

</style>
