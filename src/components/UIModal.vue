<template>
    <div class="modal" @click="close('clickOutside')">
    <!-- <div class="modal"> -->
        <div class="modal__content" @click.stop>
            <slot></slot>
            <button class="modal__button" @click="close">
                <i class="icon-cross"></i>
            </button>
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
    }
}
</script>

<style>

</style>