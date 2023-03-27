<template>
    <div class="textArea">
        <div class="textArea__title" :class="{small: style == 'small'}">
            {{ title }}
        </div>
        <div class="textArea__holder">
            <textarea v-model="innerValue" :placeholder="placeholder"></textarea>
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
            placeholder: String,
            style: {
                type: String,
                default: "text"
            }
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