<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="myProjectsPage">
            <div class="myProjectsPage__loader">
                <UILoadingSpinner v-if="isLoading"></UILoadingSpinner>
            </div>

            <div class="myProjectsPage__block" v-if="completedList.length > 0 && !isLoading">
                <div class="titleText pageTitle">Активные проекты</div>
                <SearchingProjectCard v-for="proj in dataArray" :title="proj.title" :key="proj.id" :status="'Поиск исполнителя'" :responses="0"></SearchingProjectCard>

                <div class="myProjectsPage__blockFooter">
                    <UIButton :style="'primary'" @click="$router.push('/user/createProject')">Создать проект XD</UIButton>
                </div>
            </div>

            <div class="myProjectsPage__block" v-if="searchList.length > 0 && !isLoading">
                <div class="titleText pageTitle">Поиск исполнителя</div>
                <SearchingProjectCard v-for="proj in dataArray" :title="proj.title" :projectId="proj.id" :key="proj.id" :status="'Поиск исполнителя'" :responses="0" :imageName="proj.main_picture"></SearchingProjectCard>

                <div class="myProjectsPage__blockFooter">
                    <UIButton @click="$router.push('/user/search')" :style="'primary'">Искать исполнителя</UIButton>
                    <UILink :link="'/mySuggestions'">Мои предложения исполнителям<span v-if="countOfSuggestoins > 0" style="margin-left: 0.3em;">({{countOfSuggestoins}})</span></UILink>
                </div>
            </div>

            <div class="myProjectsPage__block" v-if="activeList.length > 0 && !isLoading">
                <div class="titleText pageTitle">Завершенные проекты</div>

                <SearchingProjectCard></SearchingProjectCard>
            </div>

            <div class="myProjectsPage__placeholder" v-if="dataArray.length <= 0">
                Проекты, созданные вами, не найдены
                <UIButton @click="$router.push('/user/createProject')" :style="'primary'">Создать проект XD</UIButton>
            </div>
        </div>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue'
import UIInformationCard from '@/components/UIInformationCard.vue';
import {ProjectListController} from '@/helpers/projectListController.js'
import UILoadingSpinner from "@/components/UILoadingSpinner.vue"
import UIButton from '@/components/Buttons/UIButton.vue';
import UILink from '@/components/FormComponents/UILink.vue';

import SearchingProjectCard from  '@/components/ProjectCards/SearchingProjectCard.vue'

export default {
    components: {
        UIHeader, UIInformationCard, UILoadingSpinner, SearchingProjectCard, UIButton, UILink,
    },
    data() {
        return {
            isLoading: true,
            viewModel: new ProjectListController(),
            dataArray: [],
            countOfSuggestoins: 0,
        }
    },
    methods: {
        async fetchProjects() {
            try {
                this.isLoading = true
                this.dataArray = await this.viewModel.getProjectList()
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
        },
    },
    mounted() {
        this.fetchProjects()
    },
    computed: {
        activeList: function() {
            return this.dataArray.filter(i => i.status == "active")
            //
        },
        searchList: function() {
            return this.dataArray.filter(i => i.status == "search")
            //
        },
        completedList: function() {
            return this.dataArray.filter(i => i.status == "archive")
            //
        }
    }
}
</script>

<style>
</style>