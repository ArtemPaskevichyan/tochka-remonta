<template>
    <div class="imageLoader">
        <div v-if="title.length > 0" class="imageLoader__title">{{ title }}</div>
        <label class="imageLoader__dropzone" :class="{draggedover: isBeingDraggedOver}" @dragover.prevent="dragOverHandling" @dragleave="dragLeaveHandling" @drop="dropHandling">
            <input ref="imageInput" type="file" @change="inputImagePick">
            <i v-if="!imageSrc" class="icon-camera imageLoader__icon"></i>
            <div v-if="!imageSrc" class="imageLoader__label">
                Перетащите фото или выберите из файлов
            </div>
            <img v-else class="imageLoader__image" :src="imageSrc" alt=""/>
        </label>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isBeingDraggedOver: false,
        }
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        imageSrc: {
            type: String,
            required: true,
            default: undefined,
        },
    },
    methods: {
        dragOverHandling() {
            this.isBeingDraggedOver = true
        },
        dragLeaveHandling() {
            this.isBeingDraggedOver = false
        },
        dropHandling(event) {
            event.preventDefault()
            this.dragLeaveHandling()

            const files = event?.dataTransfer?.files
            const file = files[0]
            this.$emit('update:imageSrc', window.URL.createObjectURL(file))
            this.$emit('fileLoaded', file)
            this.isBeingDraggedOver = false
        },
        inputImagePick(event) {
            const files = event?.target?.files
            const file = files[0]
            this.$emit('update:imageSrc', window.URL.createObjectURL(file))
            this.$emit('fileLoaded', file)
        }
    },
}
</script>

<style>
</style>