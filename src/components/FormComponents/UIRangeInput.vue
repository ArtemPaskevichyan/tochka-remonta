<template>
    <div class="rangeCheck">
        <div class="rangeCheck__title">
            {{ title }}
        </div>
        <div class="rangeCheck__holder">
            <UICleaveInput 
            v-model:value="innerStartValue" :size="'short'" :role="role"
            :placeholder="startInput.placeholder ? startInput.placeholder : undefined"
            :prefix="startInput.prefix ? startInput.prefix : undefined"
            :suffix="startInput.suffix ? startInput.suffix : undefined">
            </UICleaveInput>
            <UICleaveInput 
            v-model:value="innerEndValue" :size="'short'" :role="role"
            :placeholder="endInput.placeholder ? endInput.placeholder : undefined"
            :prefix="endInput.prefix ? endInput.prefix : undefined"
            :suffix="endInput.suffix ? endInput.suffix : undefined">
            </UICleaveInput>
        </div>
    </div>
</template>

<script>
import UICleaveInput from "./UICleaveInput.vue"

export default {
    components: {
        UICleaveInput,
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
            type: Object,
            required: true,
        },
        endInput: {
            type: Object,
            required: true,
        },
        startValue: {
            type: String,
            required: true,
        },
        endValue: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'number',
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