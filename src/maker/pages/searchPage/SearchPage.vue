<template>
    <div class="headerPage tabBarPage">
        <UIHeader/>
        <UITabBar :page="'Поиск'"/>
        <div class="searchPage__header">
            <div class="warning searchPage__warning" v-if="!profileFilledEnough">
                Чтобы пользоваться всеми возможностями платформы, настройте профиль. Заполните данные о себе, чтобы уровень заполненности составлял не менее {{ fullnessBarrier }}%. Это необходимо для безопасности вашей работы на платформе.
                <div class="searchPage__warningButton">
                    <UIButton :style="'default'" @click="$router.push('/user/settingsPage')">Настроить профиль</UIButton>
                </div>
            </div>
        </div>
        <div class="titleText pageTitle searchPage__title">Проекты</div>
        <UISearchBar class="searchPage__searchBar" v-model:suggestions="searchSuggestions" :placeholder="'Найти проект'" :ref="'searchBar'"
        v-model:text="searchText" :filtersCount="filtersCount" @chosen="searchChosen" @search="goSearch" @filtersHasBeenOpened="prepareFilters">
            <template v-slot:filterContent>
                <UIMultiChoise :title="'Вид объекта'" :foldable="true" v-model:selectionData="filters.completed_projects"/>
                <UIMultiChoise :title="'Вид ремонта'" :foldable="true" v-model:selectionData="filters.completed_projects"/>
                <UIMultiChoise :title="'Вид работы'" :foldable="true" v-model:selectionData="filters.completed_projects"/>
                <UIMultiChoise :title="'Покрытие стен'" :foldable="true" v-model:selectionData="filters.completed_projects"/>
                <UIMultiChoise :title="'Напольное покрытие'" :foldable="true" v-model:selectionData="filters.completed_projects"/>
                <UIMultiChoise :title="'Потолок'" :foldable="true" v-model:selectionData="filters.completed_projects"/>
                <UIMultiChoise :title="'Инженерные сети'" :foldable="true" v-model:selectionData="filters.completed_projects"/>
                <UIMultiChoise :title="'Тип дома'" :foldable="true" v-model:selectionData="filters.completed_projects"/>
                <UIButton :style="'primary'" @click="setFilters">Применить</UIButton>
            </template>
        </UISearchBar>
        <ForMakerProjectCard class="searchPage__project" :key="p.id" v-for="p in projectList"
        :price="p.planned_budget_up" :imageName="p.main_picture" :description="p.description"
        :projectId="p.id" :title="p.title"/>

        <div class="searchPage__caption" v-if="projectList?.length == 0">
            Проекты по вашему запросу не найдены
        </div>
    </div>
</template>

<script>
import UITabBar from '@/components/UITabBar.vue';
import UIHeader from '@/components/Header/UIHeader.vue';
import UISearchBar from '@/components/UISearchBar.vue';
import ForMakerProjectCard from '@/components/ProjectCards/ForMakerProjectCard.vue';
import { userProfileFullnessLimit } from '@/preferenses';

import { UserDataController } from '@/helpers/UserDataController';
import { SearchPageController } from "@/maker/pages/searchPage/helpers/searchPageController.js"
import UIMultiChoise from "@/components/FormComponents/UIMultiChoise.vue";
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIHeader, UISearchBar, ForMakerProjectCard, UITabBar,
        UIMultiChoise, UIButton,
    },
    data() {
        return {
            searchText: "",
            searchSuggestions: [],
            viewModel: new SearchPageController(),
            projectList: [],
            projectInitialList: [],
            offset: 0,
            LIMIT: 10,
            filters: {
                average_check: [
                    {id: 0, label: "до 50 000 ₽", active: false, value: 50000},
                    {id: 1, label: "до 100 000 ₽", active: false, value: 100000},
                    {id: 2, label: "до 200 000 ₽", active: false, value: 200000},
                ],
                completed_projects: [
                    {id: 0, label: "от 10", active: false, value: 10},
                    {id: 1, label: "от 20", active: false, value: 20},
                    {id: 2, label: "от 50", active: false, value: 50},
                ],
                rating: [
                    {id: 0, label: "3.0+", active: false, value: 3},
                    {id: 1, label: "4.0+", active: false, value: 4},
                    {id: 2, label: "5.0+", active: false, value: 5},
                ],
                city: "",
                role: undefined,
            },
            realFiltersList: {},
            fullnessBarrier: userProfileFullnessLimit,
            profileFilledEnough: true,
        }
    },
    methods: {
        searchChosen(index) {
            this.searchSuggestions = []
        },
        goSearch() {
            this.projectList = this.projectInitialList.filter(p => p.title.toLowerCase().includes(this.searchText.toLowerCase()))
        },
        async getProjectsList() {
            var model = {status: 'search'}
            this.projectList = await this.viewModel.getProjectsByFilters(this.offset, this.LIMIT, model)
            this.projectInitialList = [...this.projectList]
        },
        setFilters() {
            this.realFiltersList = {}
            for (let key in this.filters) {
                let value = this.filters[key]
                if (Array.isArray(value)) value = this.getActiveFrom(value)
                if (value !== undefined) this.realFiltersList[key] = value
            }
            this.$refs.searchBar.showHideFilters()
            this.goSearch()
        },
        async getProfileFillness() {
            UserDataController.shared.profileFilledEnough()
                .then((response) => {
                    console.log(response)
                    this.profileFilledEnough = response
                })
        }
    },
    mounted() {
        this.getProjectsList()
        this.goSearch()
        this.getProfileFillness()
    },
    watch: {
    },
    computed: {
        filtersToSearch: function() {
            return this.realFiltersList
        },
        filtersCount: function() {
            return Object.keys(this.realFiltersList)?.filter(i => this.realFiltersList[i])?.length
        }
    }
}
</script>

<style>

</style>