<template>
    <div class="negotiationView">
        <div class="negotiationView__title modal__defaultTitle">Согласовать</div>
        <div class="negotiationView__subtitle baseText">
            {{ model?.title }}
        </div>
        <div class="negotiationView__description baseText">
            {{ model?.description }}
        </div>

        <div class="negotiationView__footer" v-if="!watchOnly">
            <UIButton :style="'secondary'" @click="$emit('deny')">Отклонить</UIButton>
            <UIButton :style="'primary'" @click="$emit('allow')">Согласовать</UIButton>
        </div>
    </div>


</template>

<script>
import UIButton from '@/components/Buttons/UIButton.vue'

export default {
    components: {
        UIButton,
    },
    data() {
        return {

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