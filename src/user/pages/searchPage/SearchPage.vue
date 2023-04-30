<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="titleText pageTitle">Исполнители</div>
        <UISearchBar class="searchPage__searchBar" v-model:suggestions="searchSuggestions" :placeholder="'Найти компанию'" :ref="'searchBar'"
        v-model:text="searchText" :filtersCount="filtersCount" @chosen="searchChosen" @search="goSearch" @filtersHasBeenOpened="prepareFilters">
            <template v-slot:filterContent>
                <UIParamInput :title="'Проектов выполненно'" :prefix="'от'" :placeholder="'1'" v-model:value="filters.completed_projects"/>
                <UIParamInput :title="'Рейтинг'" :prefix="'от'" :placeholder="'4.5'" v-model:value="filters.rating"/>
                <UIParamInput :title="'Дней на платформе'" :placeholder="'20'" v-model:value="filters.registred_days"/>
                <UIButton :style="'primary'" @click="setFilters">Применить</UIButton>
            </template>
        </UISearchBar>
        <MakerProfileCard class="searchPage__card" v-for="(m, index) in makerList" :model="m" :key="index"
        @goTo="goTo(m)" @suggest="seggestTo(m)" @ratingSetten="rating => m.rating = rating"/>
    </div>

    <UIModal v-if="isSuggestOpened" v-model:isOpened="isSuggestOpened">
        <SuggestProject :makerModel="makerToSuggest"/>
    </UIModal>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue';
import UISearchBar from '@/components/UISearchBar.vue';
import MakerProfileCard from '@/components/Supports/makerProfileCard/MakerProfileCard.vue';
import { SearchingController } from '@/user/pages/searchPage/helpers/serchingController.js'
import UIModal from '@/components/UIModal.vue';
import SuggestProject from '@/user/pages/components/SuggestProject.vue';
import UIInput from '@/components/FormComponents/UIInput.vue';
import UIParamInput from '@/components/FormComponents/UIParamInput.vue';
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIHeader, UISearchBar, MakerProfileCard, UIModal,
        SuggestProject, UIInput, UIParamInput, UIButton,
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
                completed_projects: '',
                rating: '',
                registred_days: '',
            },
            realFiltersList: {},
            viewController: new SearchingController(this.filtersToSearch),
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
            console.log("j", this.realFiltersList)
            for (var i in this.realFiltersList) {
                if (!this.realFiltersList[i]) {continue}
                console.log(i, this.realFiltersList[i])
                this.filters[i] = String(this.realFiltersList[i])
            }
        },

        setFilters() {
            for (var i in this.filters) {
                if (this.filters[i].length == 0) { this.realFiltersList[i] = undefined; continue }
                const num = Number(this.filters[i])
                if (isNaN(num) || num == 0) { this.realFiltersList[i] = undefined; continue }
                this.realFiltersList[i] = num
            }
            this.$refs.searchBar.showHideFilters()
            this.goSearch()
        },
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