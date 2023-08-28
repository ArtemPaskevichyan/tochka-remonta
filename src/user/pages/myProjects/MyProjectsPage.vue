<template>
    <div class="headerPage tabBarPage">
        <UIHeader/>
        <UITabBar :page="'Мои проекты'"/>
        <div class="myProjectsPage">
            <div class="myProjectsPage__placeholder" v-if="dataArray.length <= 0">
                Проекты, созданные вами, не найдены
            </div>
            <div class="myProjectsPage__pageHeader">
                <UIButton :style="'primary'" @click="$router.push('/user/createProject')"><i class="icon-plus inline-icon m-r"></i> Создать проект</UIButton>
            </div>

            <div class="myProjectsPage__loader">
                <UILoadingSpinner v-if="isLoading"></UILoadingSpinner>
            </div>

            <div class="myProjectsPage__block" v-if="activeList.length > 0 && !isLoading">
                <div class="titleText pageTitle">Активные проекты</div>
                <ActiveProjectCard
                    v-for="proj in activeList"
                    :title="proj.title"
                    :projectId="proj.id"
                    :key="proj.id"
                    :status="'Поиск исполнителя'"
                    :imageName="proj.main_picture"
                    :progress="proj.progress ?? 0"
                    @action="$router.push('/user/project/' + String(proj.id))"
                />

                <!-- <div class="myProjectsPage__blockFooter">
                    <UIButton :style="'primary'" @click="$router.push('/user/createProject')">Создать проект <i class="icon-plus inline-icon"></i></UIButton>
                </div> -->
            </div>

            <div class="myProjectsPage__block" v-if="searchList.length > 0 && !isLoading">
                <div class="titleText pageTitle">Поиск исполнителя</div>
                <SearchingProjectCard
                    v-for="proj in searchList"
                    :title="proj.title"
                    :projectId="proj.id"
                    :key="proj.id"
                    :status="'Поиск исполнителя'"
                    :responses="0"
                    :imageName="proj.main_picture"
                    @action="$router.push('/user/project/' + String(proj.id))"
                />

                <div class="myProjectsPage__blockFooter">
                    <UIButton @click="$router.push('/user/search')" :style="'primary'">Искать исполнителя</UIButton>
                    <UILink :link="'/user/outcomingSuggestions'">Мои предложения исполнителям<span v-if="countOfSuggestoins > 0" style="margin-left: 0.3em;">({{countOfSuggestoins}})</span></UILink>
                </div>
            </div>

            <div class="myProjectsPage__block" v-if="completedList.length > 0 && !isLoading">
                <div class="titleText pageTitle">Завершенные проекты</div>
                <ArchiveProjectCard
                    v-for="proj in completedList"
                    :title="proj.title"
                    :projectId="proj.id"
                    :key="proj.id"
                    :status="'Поиск исполнителя'"
                    :imageName="proj.main_picture"
                    :description="proj.description"
                    @action="$router.push('/user/project/' + String(proj.id))"
                    :rating="proj.rating"
                />
            </div>
        </div>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue'
import UITabBar from '@/components/UITabBar.vue'
import UIInformationCard from '@/components/UIInformationCard.vue';
import {ProjectListController} from '@/helpers/projectListController.js'
import UILoadingSpinner from "@/components/UILoadingSpinner.vue"
import UIButton from '@/components/Buttons/UIButton.vue';
import UILink from '@/components/FormComponents/UILink.vue';

import SearchingProjectCard from  '@/components/ProjectCards/SearchingProjectCard.vue'
import ActiveProjectCard from '@/components/ProjectCards/ActiveProjectCard.vue';
import ArchiveProjectCard from '@/components/ProjectCards/ArchiveProjectCard.vue';

export default {
    components: {
        UIHeader, UIInformationCard, UILoadingSpinner, UIButton, UILink,
        SearchingProjectCard, ActiveProjectCard, ArchiveProjectCard, UITabBar,
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

                for (let i = 0; i < this.dataArray.length; i++) {
                    if (this.dataArray[i]?.status == 'archive') {
                        this.viewModel.getProjectRating(this.dataArray[i]?.id)
                            .then((stars) => {
                                this.dataArray[i].rating = stars
                            })
                            .catch((error) => {
                                console.log("ERROR", error)
                            })
                    }
                }
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