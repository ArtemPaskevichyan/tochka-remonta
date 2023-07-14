<template>
    <div class="loadingWall">
        <div class="loadingWall__progressHolder">
            <UIProgressBar class="loading" v-model:value="innerProgress" :title="status" :round="true"/>
        </div>
    </div>
</template>

<script>
import UIProgressBar from "@/components/UIProgressBar.vue";

export default {
    components: {
        UIProgressBar,
    },
    data() {
        return {
            innerProgress: 0,
        }
    },
    props: {
        progress: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
        },
    },
    watch: {
        innerProgress: function() {
            this.$emit("update:progress", this.innerProgress)
        },
        progress: function() {
            this.innerProgress = this.progress
        }
    },
    mounted() {
        this.innerProgress = this.progress
    },
};
</script>