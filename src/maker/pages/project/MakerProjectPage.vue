<template>
    <div class="" v-if="project?.status == 'search'">
        <MakerSearchingProjectPage :project="project" v-model:imageNames="listOfImageNames" :projectController="viewModel"/>
    </div>
    <div class="" v-if="project?.status == 'active'">
        <MakerActiveProjectPage :project="project" v-model:imageNames="listOfImageNames" :projectController="viewModel"
        v-model:eventList="eventList" @eventCreated="this.getProjectData"/>
    </div>
    <div class="" v-if="project?.status == 'archive'">
        <MakerArchiveProjectPage :project="project" v-model:imageNames="listOfImageNames" :projectController="viewModel"/>
    </div>
</template>

<script>
import UserSearchingProjectPage from "@/user/pages/project/UserSearchingProjectPage.vue"
import MakerSearchingProjectPage from "./MakerSearchingProjectPage.vue"
import MakerActiveProjectPage from "@/maker/pages/project/MakerActiveProjectPage.vue"
import MakerArchiveProjectPage from "@/maker/pages/project/MakerArchiveProjectPage.vue"
import UILoadingWall from '@/components/UILoadingWall.vue'
import { ProjectController } from '@/maker/pages/project/helpers/projectController.js'
import { UserDataController } from "@/helpers/UserDataController"

export default {
    components: {
        UILoadingWall, MakerActiveProjectPage, MakerArchiveProjectPage,
        UserSearchingProjectPage, MakerSearchingProjectPage,
    },
    data() {
        return {
            viewModel: new ProjectController(),
            project: undefined,
            eventList: undefined,
            isLoading: false,
            uuid: undefined,
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