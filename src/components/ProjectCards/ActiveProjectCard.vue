<template>
    <UIInformationCard :title="title" :imageName="imageName" @action="$emit('action')">
        <template v-slot:body>
            <div class="activeProject__body">
                <UIProgressBar class="activeProject__progress" :title="'Прогресс выполнения'" :value="progress"/>
                Текущий статус: {{ status }}
            </div>
        </template>
        <template v-slot:button>
            Посмотреть
        </template>
    </UIInformationCard>
</template>

<script>
import UIInformationCard from '@/components/UIInformationCard.vue';
import UIProgressBar from '@/components/UIProgressBar.vue'

export default {
    components: {
        UIProgressBar, UIInformationCard,
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
        progress: Number,
    }
}
</script>