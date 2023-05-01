<template>
    <div class="achievment">
        <img :src="image" alt="" v-if="image">
    </div>
</template>

<script>
import {serverURL} from "@/preferenses.js"

export default {
    data() {
        return {
            image: undefined,
        }
    },
    props:{
        filename: {
            type: String,
            required: true,
        }
    },
    methods: {
        async fetchImage() {
            if (!this.filename) { return }
            switch(this.filename) {
                case "registration_a.png":
                    import("@/assets/images/achievments/registration_a.png")
                        .then((data) => {
                            this.image = data?.default
                        })
                    break;
                case "one_project_complete.png":
                    import("@/assets/images/achievments/one_project_complete.png")
                        .then((data) => {
                            this.image = data?.default
                        })
                    break;
            }
        },
    },
    watch: {
        filename: function() {
            this.fetchImage()
        }
    }
}
</script>