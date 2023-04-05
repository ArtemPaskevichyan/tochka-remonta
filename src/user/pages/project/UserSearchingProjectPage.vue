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
                    {{project?.start_date ?? Date.now()}}
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
                <div class="projectSearchingPage__blockTitle">
                    Описание
                    <UILink :class="{skeleton: !hasProject}" :size="'small'" :link="`/user/projectResponses/${project?.id ?? 'none'}`">
                        Все отклики
                    </UILink>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import UIGalery from '@/components/Galery/UIGalery.vue'
import UIHeader from '@/components/Header/UIHeader.vue';
import UILink from '@/components/FormComponents/UILink.vue';

export default {
    components: {
        UIGalery, UIHeader, UILink,
    },
    data() {
        return {
            
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
    }
}
</script>

<style>

</style>