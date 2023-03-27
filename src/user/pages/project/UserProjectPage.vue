<template>
    <div class="" v-if="project?.status == 'search' || true">
        <UserSearchingProjectPage :project="project" v-model:imageNames="listOfImageNames"/>
    </div>
    <div class="" v-if="project?.status == 'active'">
        
    </div>
    <div class="" v-if="project?.status == 'archive'">
        
    </div>
</template>

<script>
import UserSearchingProjectPage from "@/user/pages/project/UserSearchingProjectPage.vue"
import UILoadingWall from '@/components/UILoadingWall.vue'
import {ProjectController} from '@/user/pages/project/helpers/projectController.js'

export default {
    components: {
        UILoadingWall, UserSearchingProjectPage,
    },
    data() {
        return {
            viewModel: new ProjectController(),
            project: undefined,
            eventList: undefined,
            isLoading: false,
            listOfImageNames: undefined
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
                // this.project = await this.viewModel.getProjectId(this.projectId)
                // this.eventList = await this.viewModel.getEventList(this.projectId)
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
                return this.eventList[0]?.photos.map(el => el.filename)
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