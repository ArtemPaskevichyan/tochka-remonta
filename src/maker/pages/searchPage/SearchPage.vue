<template>
    <div class="headerPage tabBarPage">
        <UIHeader/>
        <UITabBar :page="'Поиск'"/>
        <div class="titleText pageTitle searchPage__title">Проекты</div>
        <UISearchBar class="searchPage__searchBar" v-model:suggestions="searchSuggestions" :placeholder="'Найти проект'"
        v-model:text="searchText" @chosen="searchChosen" @search="goSearch"/>

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

import { SearchPageController } from "@/maker/pages/searchPage/helpers/searchPageController.js"

export default {
    components: {
        UIHeader, UISearchBar, ForMakerProjectCard, UITabBar,
    },
    data() {
        return {
            searchText: "",
            searchSuggestions: [],
            viewModel: new SearchPageController(),
            projectList: [],
            offset: 0,
            LIMIT: 10,
        }
    },
    methods: {
        searchChosen(index) {
            this.searchSuggestions = []
        },
        goSearch() {
            
        },
        async getProjectsList() {
            var model = {status: 'search'}
            this.projectList = await this.viewModel.getProjectsByFilters(this.offset, this.LIMIT, model)
        }
    },
    mounted() {
        this.getProjectsList()
    },
    watch: {
        searchText: function() {
            // this.searchSuggestions = this.searchText.length > 0 ? [this.searchText, this.searchText, this.searchText] : []
        }
    },
}
</script>

<style>

</style>