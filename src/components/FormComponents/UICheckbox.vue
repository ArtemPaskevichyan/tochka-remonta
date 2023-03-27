<template>
    <div @click="switchValue" class="checkbox">
        <div class="checkbox__holder">
            <div class="checkbox__box" :class="{active: value}">{{inner}}</div>
        </div>
        <div class="checkbox__title" :class="{small: style == 'small'}">
            <slot></slot>
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
            value: {
                type: Boolean,
                required: true,
            },
            style: String,
        },
        methods: {
            switchValue() {
                this.$emit("update:value", !this.value)
            }
        },
        computed: {
            inner: function() {
                return this.value ? "a" : ""
            }
        }
    }
</script>

<style>

</style>