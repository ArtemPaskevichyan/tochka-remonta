<template>
    <div class="rating">
        <img :class="{mutating: changable}" :src="getImageSrc(0.5)" alt="" width="24" height="24" @click="setRating(1)">
        <img :class="{mutating: changable}" :src="getImageSrc(1.5)" alt="" width="24" height="24" @click="setRating(2)">
        <img :class="{mutating: changable}" :src="getImageSrc(2.5)" alt="" width="24" height="24" @click="setRating(3)">
        <img :class="{mutating: changable}" :src="getImageSrc(3.5)" alt="" width="24" height="24" @click="setRating(4)">
        <img :class="{mutating: changable}" :src="getImageSrc(4.5)" alt="" width="24" height="24" @click="setRating(5)">
    </div>
</template>

<script>
import fillStarImage from '@/assets/images/starIconFill.png'
import emptyStarImage from '@/assets/images/starIconEmpty.png'

export default {
    data() {
        return {}
    },
    props: {
        rating: {
            type: Number,
            required: true,
        },
        changable: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        setRating(rate) {
            if (!this.changable) { return }
            this.$emit('update:rating', rate)
        },

        getImageSrc(rateLimit) {
            return (this.rating > rateLimit) ? fillStarImage : emptyStarImage
        }
    },
}
</script>