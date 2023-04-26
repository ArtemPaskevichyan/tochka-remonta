<template>
    <div class="galeryLoader">
        <div class="galeryLoader__title">
            {{ title }}
        </div>
        <div class="galeryLoader__holder">
            <div class="uploadImageContainer">
                <div v-if="limit == imageList.length && limit != 0" class="galeryLoader__dropzone">
                    <div class="galeryLoader__label">
                        Достигнут лимит загрузки
                    </div>
                </div>
                <label v-else class="galeryLoader__dropzone" :class="{draggedover: isBeingDraggedOver}" @dragover.prevent="dragOverHandling" @dragleave="dragLeaveHandling" @drop="dropHandling">
                    <input ref="imageInput" type="file" @change="inputImagePick">
                    <i class="icon-camera galeryLoader__icon"></i>
                    <div class="galeryLoader__label">
                        Перетащите фото или выберите из файлов
                        <div v-if="limit > 0">До {{limit}} файлов</div>
                    </div>
                </label>
            </div>
            <GaleryImage :src="img.src" @remove="removeImage(img.id)" :key="img.id" v-for="img in imageList"></GaleryImage>
        </div>
    </div>
</template>

<script>
import GaleryImage from './GaleryImage.vue';

export default {
    components: {
        GaleryImage,
    },
    data() {
        return {
            isBeingDraggedOver: false,
            imageList: [],
        }
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
            console.log(files)
            const filePlacesEnabled = this.limit != 0 ? this.limit - this.imageList.length : files.length
            for (var i = 0; i < filePlacesEnabled; i++) {
                const file = files[i]   
                this.addImage(file)
            }
        },

        inputImagePick(event) {
            const files = event?.target?.files
            const filePlacesEnabled = this.limit != 0 ? this.limit - this.imageList.length : files.length
            for (var i = 0; i < filePlacesEnabled; i++) {
                const file = files[i]   
                this.addImage(file)
            }
        },

        addImage(file) {
            var imageModel = {
                id: this.imageList.length,
                file: file,
                src: window.URL.createObjectURL(file),
            }
            this.imageList.push(imageModel)
            this.$emit("loadedImage", imageModel)
        },

        removeImage(id) {
            console.log("RM", id)
            this.$emit("remove", id)
            this.imageList = this.imageList.filter(img => img.id != id)
        }
    },
    props: {
        limit: {
            type: Number,
            default: 10,
        },
        title: String,
    }
}
</script>

<style>

</style>