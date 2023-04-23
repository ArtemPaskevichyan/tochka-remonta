<template>
    <UIInformationCard :title="title" :imageName="imageName" @action="$router.push('/maker/project/' + String(projectId))" :buttonStyle="'primary'">
        <template v-slot:body>
            {{ description }}
        </template>
        <template v-slot:footer >
            <div class="forMakerProject__footer">Бюджет: до {{ price }} ₽</div>
        </template>
        <template v-slot:button>
            Посмотреть
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
        description: String,
        price: String,
    }
}
</script>