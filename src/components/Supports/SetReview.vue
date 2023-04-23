<template>
    <div class="setReview">
        <div class="setReview__title largeText">
            {{title ?? "Ваш отзыв"}}
        </div>
        <UITextInput v-model:value="innerText" :placeholder="'Опишите работу этого исполнителя'"
        :class="{error: textError}"/>
        <UIRating :changable="true" v-model:rating="innerRating"/>
    </div>
</template>

<script>
import UITextInput from '@/components/FormComponents/UITextInput.vue';
import UIRating from '@/components/FormComponents/UIRating.vue';

export default {
    components: {
        UITextInput, UIRating,
    },
    data() {
        return {
            innerText: '',
            innerRating: undefined,
        }
    },
    props: {
        text: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        textError: {
            type: Boolean,
            default: false,
        },
        title: String
    },
    watch: {
        innerText: function() {
            this.$emit('update:text', this.innerText)
        },
        innerRating: function() {
            this.$emit('update:rating', this.innerRating)
        }
    },
    mounted() {
        this.innerText = this.text
        this.innerRating = this.rating
    },
}
</script>

