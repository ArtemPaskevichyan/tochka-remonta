<template>
    <button class="button" :class="style"><slot></slot></button>
</template>

<script>
    export default {
        data() {
            return{}
        },
        props: {
            style: {
                type: String,
                required: false,
                default: "default",
            }
        },
    }
</script>

<style>
</style>