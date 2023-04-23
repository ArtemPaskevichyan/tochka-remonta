<template>
    <div class="negotiationCreation">
        <div class="negotiationCreation__title modal__defaultTitle">Создание согласования</div>
        <UIInput :title="'Название'" :placeholder="'Название согласования'" v-model:value="title" :class="{error: titleError}"/>
        <UITextInput :title="'Обращение'" :placeholder="'Текст обращения для согласования'" v-model:value="text" :class="{error: textError}"/>
        <div class="negotiationCreation__footer">
            <UIButton :style="'primary'" @click="send">Отправить на согласование</UIButton>
        </div>
    </div>
</template>

<script>
import UIInput from '@/components/FormComponents/UIInput.vue';
import UITextInput from '@/components/FormComponents/UITextInput.vue';
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIInput, UITextInput, UIButton,
    },
    data() {
        return {
            title: "",
            text: "",
            titleError: false,
            textError: false,
        }
    },
    methods: {
        send() {
            if (this.title.length == 0) {
                this.titleError = true
                return
            } else if (this.text.length == 0) {
                this.textError = true
                return
            }
            this.$emit('send', this.dataModel)
        }
    },
    computed: {
        dataModel: function() {
            return {
                title: this.title,
                text: this.text,
            }
        }
    },
    watch: {
        text: function() {
            this.textError = false
        },
        title: function() {
            this.titleError = false
        }
    }
}
</script>