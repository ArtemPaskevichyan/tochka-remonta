<template>
    <div class="eventCreation">
        <div class="eventCreation__title modal__defaultTitle">Создание события</div>
        <UITextInput :title="'Описание'" :placeholder="'Описание события'" v-model:value="text" :class="{error: textError}"/>
        <UIImageLoader :title="'Фото'" v-model:imageSrc="imageSrc" @fileLoaded="handleFile"/>
        <div class="eventCreation__footer">
            <UIButton :style="'primary'" @click="load">Загрузить событие</UIButton>
        </div>
    </div>
</template>

<script>
import UITextInput from '@/components/FormComponents/UITextInput.vue';
import UIImageLoader from '@/components/FormComponents/ImageLoaders/UIImageLoader.vue';
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UITextInput, UIImageLoader, UIButton,
    },
    data() {
        return {
            text: "",
            imageSrc: "",
            image: undefined,
            textError: false,
        }
    },
    methods: {
        load() {
            if (this.text?.length == 0) {      
                this.textError = true
                return
            }
        
            this.$emit('load', this.dataModel)
        },
        handleFile(file) {
            this.image = file
        },
    },
    computed: {
        dataModel: function() {
            return {
                image: this.image,
                text: this.text,
            }
        }
    },
    watch: {
        text: function() {
            this.textError = false
        }
    }
}
</script>