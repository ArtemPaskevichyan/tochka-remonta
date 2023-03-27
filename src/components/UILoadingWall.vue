<template>
    <div class="loadingWall">
        <div class="loadingWall__spinnerHolder">
            <UILoadingSpinner></UILoadingSpinner>
        </div>
    </div>
</template>

<script>
import UILoadingSpinner from './UILoadingSpinner.vue';

export default {
    components: {
        UILoadingSpinner, 
    },
    data() {
        return {}
    }
}
</script>

<style>
</style>