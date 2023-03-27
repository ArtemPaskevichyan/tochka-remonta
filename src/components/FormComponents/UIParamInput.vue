<template>
    <div class="paramInput">
        <div class="input__title" :class="{small: style == 'small'}">
            {{ title }}
        </div>
        <div class="paramInput__holder" :class="{short: size == 'short'}">
            <span v-if="prefix" class="paramInput__label">{{ prefix }}</span>
            <input v-model="innerValue" :placeholder="placeholder">
            <span v-if="suffix" class="paramInput__label">{{ suffix }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            innerValue: "",
        }
    },
    props: {
        title: String,
        value: {
            type: String,
            required: true,
        },
        placeholder: String,
        prefix: String,
        suffix: String,
        size: String,
        style: String
    },
    watch: {
        innerValue: function() {
            this.$emit("update:value", this.innerValue)
        },
        value: function() {
            this.innerValue = this.value
        }
    }
}
</script>

<style>

</style>