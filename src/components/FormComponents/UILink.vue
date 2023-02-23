<template>
    <router-link @click.stop :class="{ small: size == 'small' }" :to="link" class="link">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
    data() {
        return {

        }
    },

    props: {
        link: {
            type: String,
            required: true,
        },
        params: {
            type: Object,
            required: false,
        },
        size: {
            type: String,
            required: false,
            default: "medium",
        },
    }
}
</script>

<style>
</style>