<template>
    <div class="negotiationView">
        <div class="negotiationView__title modal__defaultTitle">Согласовать</div>
        <div class="negotiationView__subtitle baseText">
            {{ model?.title }}
        </div>
        <div class="negotiationView__description baseText">
            {{ model?.description }}
        </div>

        <div class="negotiationView__description baseText" v-if="model?.decision_text">
            Комментарий: {{ model?.decision_text }}
        </div>

        <div class="negotiationView__footer negotiationView__footerText" v-if="model?.decision">
            Вердикт: {{ Boolean(model?.decision) ? "Одобрено" : "Отклонено" }}
        </div>
        <div v-else-if="!watchOnly">
            <div class="negotiationView__textArea">
                <UITextInput :title="'Комментарий'" :placeholder="'Дополнение к решению...'" v-model:value="text"/>
            </div>
            <div class="negotiationView__footer">
                <UIButton :style="'secondary'" @click="$emit('deny', text)">Отклонить</UIButton>
                <UIButton :style="'primary'" @click="$emit('allow', text)">Согласовать</UIButton>
            </div>
        </div>
    </div>


</template>

<script>
import UIButton from '@/components/Buttons/UIButton.vue'
import UITextInput from '@/components/FormComponents/UITextInput.vue'

export default {
    components: {
        UIButton, UITextInput,
    },
    data() {
        return {
            text: "",
        }
    },
    props: {
        model: {
            type: Object,
            required: true,
        },
        watchOnly: {
            type: Boolean,
            default: false,
        }
    }
}
</script>