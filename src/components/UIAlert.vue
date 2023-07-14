<template>
    <div class="alert" @click="close('clickOutside')">
        <div class="alert__content" @click.stop>
            <div class="alert__body">
                <slot name="body"></slot>
            </div>
            <button class="alert__button" @click="close">
                <i class="icon-cross"></i>
            </button>
            <div class="alert__controls" ref="controls" :class="orientation">
                <slot name="controls"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orientation: 'horizontal',
        }
    },
    props: {
        isOpened: {
            required: true,
            type: Boolean,
        },
        closeOnClickOutside: {
            default: true,
            type: Boolean,
        },
    },
    methods: {
        close(closer) {
            if (closer == 'clickOutside' && !this.closeOnClickOutside) { return }
            this.$emit('close')
            this.$emit('update:isOpened', false)
        }
    },
    mounted() {
        if (this.$refs.controls?.children?.length >= 3) {
            this.orientation = 'vertical'
        }
    },
}
</script>

<style>

</style>