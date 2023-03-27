<template>
    <UIInformationCard :title="title" :imageName="imageName">
        <template v-slot:body class="searchingProject__body">
            Текущий статус: {{ status }}
        </template>
        <template v-slot:footer>
            <span v-if="responses <= 0" class="searchingProject__resp">
                Откликов нет
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
import { TokenHandler } from '@/helpers/TokenHandler'
import { serverURL } from '@/preferenses'
import axios from 'axios'

export default {
    components: {
        UIInformationCard, UILink,
    },
    data() {
        return {
            imageSrc: undefined,
            imageError: false,
        }
    },
    props: {
        imageName: {
            required: true,
            type: String,
            default: ''
        },
        title: String,
        status: String,
        responses: {
            type: Number,
            default: 0,
        }
    },
    mounted() {

    },
}
</script>

<style>

</style>