<template>
    <div class="headerPage tabBarPage">
        <UIHeader/>
        <UITabBar :page="'Поиск'"/>
        <div class="searchPage__header">
            <div class="warning searchPage__warning" v-if="!profileFilledEnough">
                Чтобы пользоваться всеми возможностями платформы, настройте профиль. Заполните данные о себе, чтобы уровень заполненности составлял не менее {{ fullnessBarrier }}%. Это необходимо для безопасности вашей работы на платформе.
                <div class="searchPage__warningButton">
                    <UIButton :style="'default'" @click="$router.push('/maker/settingsPage')">Настроить профиль</UIButton>
                </div>
            </div>
        </div>
        <div class="titleText pageTitle searchPage__title">Проекты</div>
        <UISearchBar
            class="searchPage__searchBar"
            v-model:suggestions="searchSuggestions"
            :placeholder="'Найти проект'"
            :ref="'searchBar'"
            v-model:text="searchText"
            :filtersCount="filtersCount"
            @chosen="searchChosen"
            @search="goSearch"
            @filtersHasBeenOpened="prepareFilters"
        >
            <template v-slot:filterContent>
                <UIMultiChoise :title="'Вид объекта'" :single="true" :foldable="true" v-model:selectionData="filters.is_new_building"/>
                <UIMultiChoise :title="'Вид ремонта'" :single="true" :foldable="true" v-model:selectionData="filters.repair_type"/>
                <UIMultiChoise :title="'Вид работы'" :single="true" :foldable="true" v-model:selectionData="filters.job_type"/>
                <UIMultiChoise :title="'Покрытие стен'" :foldable="true" v-model:selectionData="filters.wall_covering"/>
                <UIMultiChoise :title="'Напольное покрытие'" :foldable="true" v-model:selectionData="filters.floor_covering"/>
                <UIMultiChoise :title="'Потолок'" :foldable="true" v-model:selectionData="filters.ceiling"/>
                <UIMultiChoise :title="'Инженерные сети'" :foldable="true" v-model:selectionData="filters.engineering_networks"/>
                <UIMultiChoise :title="'Тип дома'" :single="true" :foldable="true" v-model:selectionData="filters.house_type"/>
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
                is_new_building: [
                    {id: 0, label: "Вторичка", active: false, value: false},
                    {id: 1, label: "Новостройка", active: false, value: true},
                ],
                repair_type: [
                    {id: 0, label: "Под ключ", active: false, value: "Под ключ"},
                    {id: 1, label: "Частичный", active: false, value: "Частичный"},
                ],
                job_type: [
                    {id: 0, label: "Только черновые", active: false, value: "Только черновые"},
                    {id: 1, label: "Только чистовые", active: false, value: "Только чистовые"},
                    {id: 2, label: "Комплекс", active: false, value: "Комплекс"},
                ],
                house_type: [
                    {id: 0, label: "Квартира", active: false, value: "Квартира"},
                    {id: 1, label: "Дом", active: false, value: "Дом"},
                ],
                wall_covering: [
                    {id: 0, label: "Обои", active: false, value: "Обои"},
                    {id: 1, label: "Покраска", active: false, value: "Покраска"},
                    {id: 2, label: "Плитка", active: false, value: "Плитка"},
                    {id: 3, label: "Обои под покраску", active: false, value: "Обои под покраску"},
                    {id: 4, label: "Декоративная штукатурка", active: false, value: "Декоративная штукатурка"},
                    {id: 5, label: "Другое", active: false, value: "Другое"},
                ],
                floor_covering: [
                    {id: 0, label: "Ламинат", active: false, value: "Ламинат"},
                    {id: 1, label: "Кварцвинил", active: false, value: "Кварцвинил"},
                    {id: 2, label: "Паркет", active: false, value: "Паркет"},
                    {id: 3, label: "Линолиум", active: false, value: "Линолиум"},
                    {id: 4, label: "Плитка", active: false, value: "Плитка"},
                    {id: 5, label: "Инженерная доска", active: false, value: "Инженерная доска"},
                    {id: 6, label: "Другое", active: false, value: "Другое"},
                ],
                ceiling: [
                    {id: 0, label: "Натяжной", active: false, value: "Натяжной"},
                    {id: 1, label: "Побелка", active: false, value: "Побелка"},
                    {id: 2, label: "ГКЛ (Гибсокартоновый лист)", active: false, value: "ГКЛ (Гибсокартоновый лист)"},
                    {id: 3, label: "Другое", active: false, value: "Другое"},
                ],
                engineering_networks: [
                    {id: 0, label: "Электрика", active: false, value: "Электрика"},
                    {id: 1, label: "Климототехника", active: false, value: "Климототехника"},
                    {id: 2, label: "Сантехника", active: false, value: "Сантехника"},
                    {id: 3, label: "Другое", active: false, value: "Другое"},
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
        async goSearch() {
            try {
                this.isDataLoading = true
                this.projectList = await this.viewModel.getProjectsByFilters(this.realFiltersList)
                this.projectList = this.projectList.filter(p => p.title?.toLowerCase().includes(this.searchText.toLowerCase()))
            } catch(e) {
                console.log("ERROR", e)
                //
            } finally {
                this.isDataLoading = false
            }
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
        },
        getActiveFrom(filterParameter) {
            let count = 0; 
            let result;
            for (let i of filterParameter) {
                if (i.active) {
                    if (count == 0) {
                        result = i.value
                        count += 1
                    }
                    else if (count == 1) {
                        result = [result]
                        result.push(i.value)
                        count += 1
                    } else {
                        result.push(i.value)
                        count += 1
                    }
                }
            }
            return result
        },
    },
    mounted() {
        this.goSearch()
        this.getProfileFillness()
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