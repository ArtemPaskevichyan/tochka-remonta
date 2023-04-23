<template>
    <UIInformationCard :title="title" :imageName="imageName" :isLoading="isLoading"
    :buttonStyle="'primary'" @action="$emit('suggest', projectId)">
        <template v-slot:body>
            Текущий статус: {{ status }}
        </template>
        <template v-slot:button>
            Предложить
        </template>
    </UIInformationCard>
</template>

<script>
import UIInformationCard from '@/components/UIInformationCard.vue'

export default {
    components: {
        UIInformationCard,
    },
    data() {
        return {

        }
    },
    props: {
        projectId: {
            required: true,
            type: Number,
        },
        imageName: {
            required: true,
            type: String,
            default: ''
        },
        title: String,
        status: String,
        isLoading: {
            type: Boolean,
            default: true,
        }
    }
}
</script>