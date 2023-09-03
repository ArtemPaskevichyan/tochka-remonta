<template>
    <div class="fileLoader">
        <div class="fileLoader__title">
            {{ title }}
        </div>
        <input type="file" ref="input" :accept="accept" @change="fetchFile">
        <div class="fileLoader__inner">
            <UIButton v-if="!file" @click="$refs.input.click()" class="fileLoader__button">Выбрать файл</UIButton>
            <div v-else class="fileLoader__fileInfo">
                <span class="fileLoader__fileName">{{ fileName }}</span>
                <span class="fileLoader__controls">
                    <UIButton @click="watchFile" class="fileLoader__destructive" :style="'square default'"><i class="icon-eye"></i></UIButton>
                    <UIButton @click="clearFile" class="fileLoader__destructive" :style="'destructive'">Удалить</UIButton>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import UIButton from "../Buttons/UIButton.vue"

export default {
    components: {
        UIButton, 
    },
    data() {
        return {
            file: false,
            fileName: "",
            inputId: this._uid+"-input",
        }
    },
    props: {
        title: String,
        accept: Array,
        preview: Boolean,
    },
    methods: {
        fetchFile(event) {
            try {
                this.$emit("fileLoaded", event.target.files[0])
                this.file = event.target.files[0]
                this.fileName = event.target.files[0].name
            } catch(e) {
                this.$emit("error", e)
            }
        },
        clearFile() {
            this.file = false
            this.fileName = ""
            this.$refs("input").value = null
            this.$emit("cleared")
        },
        watchFile() {
            if (this.file) window.open(window.URL.createObjectURL(this.file), "_blank");
        }
    },
}
</script>

<style>
</style>