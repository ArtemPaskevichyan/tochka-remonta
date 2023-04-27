<template>
    <div class="achievment">
        <img :src="imageURL" alt="">
    </div>
</template>

<script>
import {serverURL} from "@/preferenses.js"

export default {
    data() {
        return {
        }
    },
    props:{
        filename: {
            type: String,
            required: true,
        }
    },
    computed: {
        imageURL() {
            return serverURL + '/api/v1/projects/get_event_photo?fileanme=' + this.filename
        }
    }
}
</script>