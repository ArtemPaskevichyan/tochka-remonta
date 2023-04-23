<template>
    <div class="rangeCheck">
        <div class="rangeCheck__title">
            {{ title }}
        </div>
        <div class="rangeCheck__holder">
            <UIParamInput 
            v-model:value="innerStartValue" :size="'short'"
            :placeholder="startInput.placeholder ? startInput.placeholder : undefined"
            :prefix="startInput.prefix ? startInput.prefix : undefined"
            :suffix="startInput.suffix ? startInput.suffix : undefined">
            </UIParamInput>
            <UIParamInput 
            v-model:value="innerEndValue" :size="'short'"
            :placeholder="endInput.placeholder ? endInput.placeholder : undefined"
            :prefix="endInput.prefix ? endInput.prefix : undefined"
            :suffix="endInput.suffix ? endInput.suffix : undefined">
            </UIParamInput>
        </div>
    </div>
</template>

<script>
import UIParamInput from "./UIParamInput.vue"

export default {
    components: {
        UIParamInput,
    },
    data() {
        return {
            innerStartValue: "",
            innerEndValue: "",
        }
    },
    props: {
        title: String,
        startInput: {
            title: Object,
            required: true,
        },
        endInput: {
            title: Object,
            required: true,
        },
        startValue: {
            title: String,
            required: true,
        },
        endValue: {
            title: String,
            required: true,
        },
    },
    watch: {
        innerStartValue: function() {
            this.$emit("update:startValue", this.innerStartValue)
        },
        startValue: function() {
            this.innerStartValue = this.startValue
        },
        innerEndValue: function() {
            this.$emit("update:endValue", this.innerEndValue)
        },
        endValue: function() {
            this.innerEndValue = this.endValue
        },
    }
}
</script>

<style>

</style>