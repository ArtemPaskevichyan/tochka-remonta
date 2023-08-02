<template>
    <UIInformationCard :title="title" :imageName="imageName" :buttonStyle="'primary'" @action="$emit('accept', projectId)" :isLoading="!projectId">
        <template v-slot:body>
            {{ description }}
        </template>
        <template v-slot:footer>
            <div class="suggestionsCard__footer" :class="{}">
                <div class="forMakerProject__footer">Бюджет: до {{ price }} ₽</div>
                <UIButton :style="'secondary'" @click="$router.push('/maker/project/' + String(projectId))">Посмотреть</UIButton>
            </div>
        </template>
        <template v-slot:button>
            Принять проект
        </template>
    </UIInformationCard>
</template>

<script>
import UIInformationCard from '@/components/UIInformationCard.vue'
import UIButton from '@/components/Buttons/UIButton.vue'

export default {
    components: {
        UIInformationCard, UIButton,
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