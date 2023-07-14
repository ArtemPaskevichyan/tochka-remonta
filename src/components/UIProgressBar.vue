<template>
    <div class="progressBar">
        <div class="progressBar__titleBlock">
            <span class="progressBar__title">
                {{title}}
            </span>
            <span class="progressBar__value">
                {{Math.round(value)}}%
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
            innerValue: 0,
        }
    },
    props: {
        title: String,
        round: Boolean,
        value: {
            type: Number,
            required: true,
        }
    },
    computed: {
        roundedValue() {
            return Math.round(this.round)
        }
    },
    mounted() {
        this.innerValue = this.round ? this.roundedValue : this.value 
    }
}
</script>

<style>

</style>