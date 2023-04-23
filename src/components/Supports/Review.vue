<template>
    <div class="review">
        <div class="review__header">
            <div class="review__info">
                <div class="review__avatar" :class="{skeleton: isLoading}"><img :src="this.imageURL" alt="" v-if="model?.img"></div>
                <span class="review__username" :class="{skeleton: isLoading}">{{ model?.username ?? "USERNAME" }}</span>
                <UIRating :rating="model?.stars ?? 0"/>
            </div>
        </div>
        <div class="review__body baseText" :class="{skeleton: isLoading}">
            {{ (!model?.review || model?.review?.length == 0) ? "SOME FAKE TEXT OF REVIEW" : model?.review }}
        </div>
    </div>
</template>

<script>
import UIRating from '@/components/FormComponents/UIRating.vue';
import { serverURL } from '@/preferenses';

export default {
    components: {
        UIRating,
    },
    data() {
        return {
            baseURL: `${serverURL}/api/v1/auth/get_avatar?filename=`
        }
    },
    props: {
        model: {
            type: Object,
            required: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        imageURL() {
            return this.baseURL + this.model?.img
        }
    }
}
</script>