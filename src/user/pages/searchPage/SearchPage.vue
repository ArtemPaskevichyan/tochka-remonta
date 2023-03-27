<template>
    <div class="headerPage">
        <UIHeader/>
        <div class="titleText pageTitle">Исполнители</div>
    </div>
</template>

<script>
import UIHeader from '@/components/Header/UIHeader.vue';
import { UserDataController } from '@/helpers/UserDataController';

export default {
    components: {
        UIHeader,
    },
    data() {
        return {
        }
    },
    mounted() { 
        
    }
}
</script>

<style>

</style>