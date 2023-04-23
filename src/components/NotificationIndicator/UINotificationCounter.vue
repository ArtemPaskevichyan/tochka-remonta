<template>
    <span class="notificationCounter">
        {{ amout }}
    </span>
</template>

<script>
    export default {
        data() {
            return {}
        },
        props: {
            count: {
                type: Number,
                required: true,
            },
            showZero: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            amout: function() {
                return (this.count == 0 && !this.showZero) ? "" : this.count
            }
        }
    }
</script>

<style>

</style>