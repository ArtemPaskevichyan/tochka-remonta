<template>
    
    <span class="notificationIndicatorHolder">
        <slot></slot>
        <span v-if="displayZero || amount > 0 " class="notificationIndicatorHolder__indicatior">
            {{textInIndicatior}}
        </span>
    </span>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {
        amount: {
            required: true,
            type: Number,
        },
        displayZero: {
            type: Boolean,
            default: true,
        }
    },
    computed: {
        textInIndicatior: function() {
            return (this.displayZero && this.amount == -1) ? '' : this.amount
        }
    }
}
</script>

<style>

</style>