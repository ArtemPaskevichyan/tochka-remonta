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
                    <UIButton :style="'primary'" @click="sendResponse">
                        Откликнуться
                    </UIButton>
                </div>
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
import { convertDateToBase } from '@/helpers/DateConverter';

export default {
    components: {
        UIGalery, UIHeader, UILink, UIButton, UILoadingWall,
    },
    data() {
        return {
            isLoading: false,
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
                await this.projectController.sendResponse(this.project?.id, this.project?.customer_uuid)
                this.$router.push("/maker/myProjects")
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
        }
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