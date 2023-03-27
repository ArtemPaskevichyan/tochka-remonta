<template>
<div class="uploadImageContainer">
    <img :src="src" alt="">
    <UIButton @click="$emit('remove')" class="uploadImageContainer__closeButton" :style="'square small destructive'">
    X
    </UIButton>
</div>
</template>

<script>
import UIButton from '../../Buttons/UIButton.vue';

export default {
    components: {
        UIButton, 
    },
    data() {
        return {
            
        }
    },
    props: {
        src: {
            type: String,
            required: true,
        }
    }
}
</script>

<style>
</style>