<template>
    <div class="progressBar">
        <div class="progressBar__titleBlock">
            <span class="progressBar__title">
                {{title}}
            </span>
            <span class="progressBar__value">
                {{value}}%
            </span>
        </div>
        <div class="progressBar__progressHolder">
            <div class="progressBar__progress" v-bind:style="{width: String(value) + '%'}"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        title: String,
        value: {
            type: Number,
            required: true,
        }
    }
}
</script>

<style>

</style>