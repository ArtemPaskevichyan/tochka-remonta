<template>
    <div class="galeryImage">
        <img :src="src" alt="" loading="lazy">
    </div>
</template>

<script>
export default {
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