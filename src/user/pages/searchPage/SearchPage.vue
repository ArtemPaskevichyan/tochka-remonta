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
        <div class="titleText pageTitle searchPage__title">Исполнители</div>
        <UISearchBar
            class="searchPage__searchBar"
            v-model:suggestions="searchSuggestions"
            :placeholder="'Найти компанию'"
            :ref="'searchBar'"
            v-model:text="searchText"
            :filtersCount="filtersCount"
            @chosen="searchChosen"
            @search="goSearch"
            @filtersHasBeenOpened="prepareFilters"
        >
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
import { userProfileFullnessLimit } from '@/preferenses';
import { UserDataController } from "@/helpers/UserDataController.js";


import UIInput from '@/components/FormComponents/UIInput.vue';
import UIMultiChoise from "@/components/FormComponents/UIMultiChoise.vue";
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIHeader, UITabBar, UISearchBar, MakerProfileCard,
        UIModal, SuggestProject, UIInput, UIButton,
        UIMultiChoise
    },
    data() {
        return {
            isDataLoading: false,
            searchText: "",
            searchSuggestions: [],
            isSuggestOpened: false,
            makerUUIDList: [],
            makerList: [{}, {}, {}],
            makerInitialList: [],
            filters: {
                average_check: [
                    {id: 0, label: "до 15 000 ₽", active: false, value: 15000},
                    {id: 1, label: "до 30 000 ₽", active: false, value: 30000},
                    {id: 2, label: "до 60 000 ₽", active: false, value: 60000},
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
                this.makerList = await this.viewController.getMakersList(this.realFiltersList)
                console.log(this.makerList)
                this.makerList = this.makerList.filter(e => e.firstname?.toLowerCase().includes(this.searchText.toLowerCase()) && e.firstname?.length != 0)
            } catch(e) {
                console.log("ERROR", e)
                //
            } finally {
                this.isDataLoading = false
            }
        },

        seggestTo(maker) {
            this.makerToSuggest = maker
            this.isSuggestOpened = true
        },

        goTo(maker) {
            this.$router.push('/user/makerPage/' + maker.uuid)
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

        getActiveFrom(filterParameter) {
            for (let i of filterParameter) {
                if (i.active) return i.value
            }
            return undefined
        },

        async getProfileFillness() {
            UserDataController.shared.profileFilledEnough()
                .then((response) => {
                    this.profileFilledEnough = response
                })
        }
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