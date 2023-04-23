<template>
    <div class="" v-if="project?.status == 'search'">
        <UserSearchingProjectPage :project="project" v-model:imageNames="listOfImageNames" :projectController="viewModel"/>
    </div>
    <div class="" v-if="project?.status == 'active'">
        <UserActiveProjectPage :project="project" v-model:imageNames="listOfImageNames" :projectController="viewModel" v-model:eventList="eventList"/>
    </div>
    <div class="" v-if="project?.status == 'archive'">
        <UserArchiveProjectPage :project="project" v-model:imageNames="listOfImageNames" :projectController="viewModel"/>
    </div>
</template>

<script>
import UserSearchingProjectPage from "@/user/pages/project/UserSearchingProjectPage.vue"
import UserActiveProjectPage from "@/user/pages/project/UserActiveProjectPage.vue"
import UserArchiveProjectPage from "@/user/pages/project/UserArchiveProjectPage.vue"

import UILoadingWall from '@/components/UILoadingWall.vue'
import {ProjectController} from '@/user/pages/project/helpers/projectController.js'

export default {
    components: {
        UILoadingWall, UserSearchingProjectPage, UserActiveProjectPage, UserArchiveProjectPage,
    },
    data() {
        return {
            viewModel: new ProjectController(),
            project: undefined,
            eventList: undefined,
            isLoading: false,
        }
    },
    props: {
        projectId: {
            required: true,
            type: String,
        }
    },
    methods: {
        async getProjectData() {
            try {
                this.isLoading = true
                this.project = await this.viewModel.getProjectId(this.projectId)
                this.eventList = await this.viewModel.getEventList(this.projectId)
            } catch(e) {
                console.log("ERROR", e)
                alert(e)
            } finally {
                this.isLoading = false
            }
        }
    },
    computed: {
        listOfImageNames: function() {
            try {
                return this.eventList[this.eventList.length - 1]?.photos.map(el => el.filename)
            } catch(e) {
                return []
            }
        }
    },
    mounted() {
        this.getProjectData()
    }
}
</script>

<style>

</style>