<template>
    <div class="headerPage tabBarPage">
        <UIHeader/>
        <UITabBar :page="'Поиск'"/>
        <div class="titleText pageTitle searchPage__title">Исполнители</div>
        <UISearchBar class="searchPage__searchBar" v-model:suggestions="searchSuggestions" :placeholder="'Найти компанию'" :ref="'searchBar'"
        v-model:text="searchText" :filtersCount="filtersCount" @chosen="searchChosen" @search="goSearch" @filtersHasBeenOpened="prepareFilters">
            <template v-slot:filterContent>
                <UIMultiChoise :title="'Проектов выполнено'" :foldable="true" :single="true" v-model:selectionData="filters.completed_projects"/>
                <UIMultiChoise :title="'Средний чек (за М²)'" :foldable="true" :single="true" v-model:selectionData="filters.average_check"/>
                <UIMultiChoise :title="'Рейтинг'" :foldable="true" :single="true" v-model:selectionData="filters.rating"/>
                <UIButton :style="'primary'" @click="setFilters">Применить</UIButton>
            </template>
        </UISearchBar>
        <MakerProfileCard class="searchPage__card" v-for="(m, index) in makerList" :model="m" :key="index"
        @goTo="goTo(m)" @suggest="seggestTo(m)" @ratingSetten="rating => m.rating = rating"/>
        <div class="searchPage__caption" v-if="makerList?.length == 0">
            Исполнители{{filtersCount > 0 ? ' с такими параметрами ' : ' '}}не найдены 
        </div>
    </div>

    <UIModal v-if="isSuggestOpened" v-model:isOpened="isSuggestOpened">
        <SuggestProject :makerModel="makerToSuggest"/>
    </UIModal>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue';
import UITabBar from '@/components/UITabBar.vue';
import UISearchBar from '@/components/UISearchBar.vue';
import MakerProfileCard from '@/components/Supports/makerProfileCard/MakerProfileCard.vue';
import { SearchingController } from '@/user/pages/searchPage/helpers/serchingController.js'
import UIModal from '@/components/UIModal.vue';
import SuggestProject from '@/user/pages/components/SuggestProject.vue';

import UIInput from '@/components/FormComponents/UIInput.vue';
import UIMultiChoise from "@/components/FormComponents/UIMultiChoise.vue";
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIHeader, UITabBar, UISearchBar, MakerProfileCard,
        UIModal, SuggestProject, UIInput, UIButton,
        UIMultiChoise,
    },
    data() {
        return {
            isDataLoading: false,
            searchText: "",
            searchSuggestions: [],
            isSuggestOpened: false,
            makerUUIDList: [],
            makerList: [{}, {}, {}],
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
            viewController: new SearchingController(),
            makerToSuggest: undefined,
        }
    },
    methods: {
        searchChosen(index) {
            this.searchSuggestions = []
        },

        async goSearch() {
            try {
                this.isDataLoading = true
                this.makerUUIDList = await this.viewController.getMakersList(this.realFiltersList)
                this.makerUUIDList = this.makerUUIDList.map(i => i.uuid)
                this.fetchDataFromMakerList()
            } catch(e) {
                //
            } finally {
                this.isDataLoading = false
            }
        },

        async fetchDataFromMakerList() {
            this.makerList = [...Array(this.makerUUIDList?.length)].map(e=>{})
            for (let i = 0; i < this.makerUUIDList?.length; i++) {
                const uuid = this.makerUUIDList[i]
                this.viewController.getDataOfMaker(uuid)
                    .then((response) => {
                        console.log(this.makerList, i)
                        this.makerList[i] = response?.data?.user
                        this.makerList[i].isReady = true
                    })
                    .catch((error) => {
                        //
                    })
            }
        },

        seggestTo(maker) {
            this.makerToSuggest = maker
            this.isSuggestOpened = true
        },

        goTo(maker) {
            this.$router.push('/user/makerPage/' + maker.uuid)
        },

        prepareFilters() {
            // When filters window is opened copies inUse filters
            // console.log("j", this.realFiltersList)
            // for (var i in this.realFiltersList) {
            //     if (!this.realFiltersList[i]) {continue}
            //     this.filters[i] = this.realFiltersList[i]
            // }
        },

        setFilters() {
            // Make filters in use, then searches
            // for (var i in this.filters) {
            //     if (this.filters[i].length == 0) { this.realFiltersList[i] = undefined; continue }
            //     const num = Number(this.filters[i])
            //     if (isNaN(num) || num == 0) { this.realFiltersList[i] = undefined; continue }
            //     this.realFiltersList[i] = num
            // }
            this.realFiltersList = {}
            for (let key in this.filters) {
                let value = this.filters[key]
                if (Array.isArray(value)) value = this.getActiveFrom(value)
                if (value !== undefined) this.realFiltersList[key] = value
            }
            this.$refs.searchBar.showHideFilters()
            this.goSearch()
        },

        getActiveFrom(filterParameter) {
            for (let i of filterParameter) {
                if (i.active) return i.value
            }
            return undefined
        }
    },
    watch: {
        searchText: function() {
            // this.searchSuggestions = this.searchText.length > 0 ? [this.searchText, this.searchText, this.searchText] : []
        },
    },
    mounted() {
        this.goSearch()
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