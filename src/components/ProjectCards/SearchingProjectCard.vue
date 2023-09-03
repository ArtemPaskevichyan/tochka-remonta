<template>
    <UIInformationCard :title="title" :imageName="imageName" @action="$emit('action')">
        <template v-slot:body class="searchingProject__body">
            {{ description }}
        </template>
        <template v-slot:footer>
            <span v-if="responses <= 0" class="searchingProject__resp">
                
            </span>
            <span v-else class="searchingProject__resp">
                <UILink :link="'/responses'">{{responses}} откликов</UILink>
            </span>
        </template>
        <template v-slot:button>
            Посмотреть
        </template>
    </UIInformationCard>
</template>

<script>
import UIInformationCard from '@/components/UIInformationCard.vue'
import UILink from '@/components/FormComponents/UILink.vue'

export default {
    components: {
        UIInformationCard, UILink, 
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
        description: String,
        responses: {
            type: Number,
            default: 0,
        }
    }
}
</script>

<style>

</style>