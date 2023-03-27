<template>
    
    <!-- <UIGalery :imageNames="imageNames" :orientation="'h'"/> -->
    <UIGalery :orientation="'h'"/>
</template>

<script>
import UIGalery from '@/components/Galery/UIGalery.vue'

export default {
    components: {
        UIGalery, 
    },
    data() {
        return {
            
        }
    },
    props: {
        project: {
            type: Object,
            required: true,
        },
        imageNames: {
            type: Array,
            required: true,
        }
    }
}
</script>

<style>

</style>