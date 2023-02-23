<template>
    <div @click="switchValue" class="checkbox">
        <div class="checkbox__title">
            <slot></slot>
        </div>
        <div class="checkbox__holder">
            <!-- <img v-if="value" src="" alt="" height="24" width="24">
            <img v-else src="" alt="" height="24" width="24">
         -->
            <div v-if="value" >On</div>
            <div v-else >Off</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        props: {
            value: {
                type: Boolean,
                required: true,
            },
        },
        methods: {
            switchValue() {
                this.$emit("update:value", !this.value)
            }
        }
    }
</script>

<style>

</style>