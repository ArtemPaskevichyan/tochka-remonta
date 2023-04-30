<template>
<div class="input">
    <div class="input__title" :class="{small: style == 'small'}">
        {{ title }}
    </div>
    <div class="input__holder">
        <input :type="inputType" v-model="innerValue" :placeholder="placeholder" :id="idOfInput" v-if="idOfInput">
        <input :type="inputType" v-model="innerValue" :placeholder="placeholder" v-else>
        <button v-if="role == 'password'" class="input__passwordShowHideButton" @click="showHidePassword">
            <i :class="{'icon-eye' : inputType == 'password', 'icon-eye-cross' : inputType != 'password'}"></i>
        </button>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            inputType: "text",
            innerValue: "",
        }
    },
    props: {
        title: String,
        value: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "text"
        },
        placeholder: String,
        style: {
            type: String,
            default: "text"
        },
        idOfInput: {
            type: String,
            default: undefined
        },
    },
    methods: {
        showHidePassword() {
            if (this.inputType == 'password') { this.inputType = 'text' }
            else if (this.inputType == 'text') { this.inputType = 'password'}
        }
    },
    watch: {
        innerValue: function() {
            this.$emit("update:value", this.innerValue)
        },
        value: function() {
            this.innerValue = this.value
        }
    },
    mounted() {
        this.inputType = this.role
    },
}
</script>

<style>
</style>