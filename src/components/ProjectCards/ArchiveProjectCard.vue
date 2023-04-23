<template>
    <UIInformationCard :title="title" :imageName="imageName" @action="$emit('action')" :isLoading="isLoading">
        <template v-slot:body>
            {{ description }}
        </template>
        <template v-slot:footer>
            <UIRating :rating="rating"/>
        </template>
        <template v-slot:button>
            Посмотреть
        </template>
    </UIInformationCard>
</template>

<script>
import UIInformationCard from '@/components/UIInformationCard.vue'
import UILink from '@/components/FormComponents/UILink.vue'
import UIRating from '@/components/FormComponents/UIRating.vue'

export default {
    components: {
        UIInformationCard, UILink, UIRating,
    },
    data() {
        return {
            imageSrc: undefined,
            imageError: false,
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
        description: String,
        rating: Number,
        isLoading: {
            type: Boolean,
            default: false,
        }
    },
    mounted() {

    },
}
</script>

<style>

</style>